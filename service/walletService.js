// Import necessary modules and models
const { errorMessages } = require("../constants/errors");
const walletModel = require("../models/walletModel");
const { getTokenBalance } = require("../utils/wallet");
const transactionModel = require("../models/transactionModel");
const referralModel = require("../models/referralModel")
const { isEmpty } = require("lodash")
const { sendNotificationService } = require("../workers/sendNotificationService")
const {
  isValidEthereumAddress,
  getGasPrice,
  getNonce,
  signAndSendTransaction,
  transferPreSignedHex,
} = require("../utils/wallet");
const { CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY, ABI, TOKEN_DECIMAL, NETWORKS } = require("../config");
const _ = require("lodash");
const { createWallet, signAndSendTransactionOnPurchase } = require("../utils/wallet");
const apiError = require("../error/apiError");
const constant = require("../constants/constant");
const { generateReferralCode, generateReferralLink } = require("../utils/helperMethod");
const stakeModel = require("../models/stakeModel");
const { getWebInstance } = require("../utils/utils");
const { coinMint } = require("../utilityService/coinMint")


/**
 * Creates a new wallet for a user.
 * @returns {Object} The newly created wallet object.
 */
createUserWallet = async () => {
  const wallet = await createWallet();
  return wallet;
};

/**
 * Adds a new wallet or token to an existing wallet.
 * @param {Object} req - The request object containing account and token details.
 * @returns {string} A message indicating the success or failure of the operation.
 */
addWallet = async (req) => {

  let existingWallet = await walletModel.findOne({
    account: req.body.account,
  });


  if (!isEmpty(req.body.referenceCode)) {

    let referralUser = await walletModel.findOne({
      referralCode: { $regex: new RegExp(`^${req.body.referenceCode}$`, 'i') },
    });

    if (!referralUser) throw new apiError(
      "Oops! It seems like the referral code you entered is incorrect. Please double-check and try again. If you don't have a referral code, you can continue without it.",
      400
    );
    let referralExist = await referralModel.findOne({
      referenceWallet: { $regex: new RegExp(`^${referralUser.account}$`, 'i') },
      refferalWallet: { $regex: new RegExp(`^${req.body.account}$`, 'i') },
    });
    if (referralExist)

      throw new apiError(
        "It looks like you've already made a referral. If you have another code to enter, please note that you can only make one referral per account. If you need assistance, feel free to reach out",
        400
      );

    if (existingWallet && existingWallet.referralCode === req.body.referenceCode)
      throw new apiError(
        "It looks like you are referring to yourself, which is not allowed.",
        400
      );


    const referral = new referralModel({
      referenceWallet: referralUser.account,
      refferalWallet: req.body.account,

    });
    referral.save();
  }

  if (existingWallet) {


    if (isEmpty(existingWallet.referralCode)) {

      let referralCode = generateReferralCode()
      let referralLink = generateReferralLink(referralCode)
      existingWallet.referralCode = referralCode
      existingWallet.referralLink = referralLink
      existingWallet = await existingWallet.save()
    }

    if (existingWallet.tokenArray.some((t) => t.token === req.body.token)) {

      return { data: existingWallet, message: "Token already exists in the TokenArray" }
    } else {

      existingWallet.tokenArray.push({ token: req.body.token });
      existingWallet.save();
      return { data: existingWallet, message: "Token does not exist in the tokenArray, so add it." }
    }
  } else {

    let referralCode = generateReferralCode()
    let referralLink = generateReferralLink(referralCode)

    const newWallet = new walletModel({
      account: req.body.account,
      tokenArray: [{ token: req.body.token }],
      referralCode: referralCode,
      referralLink: referralLink
    });
    newWallet.save();
    if (req.body.type === "New") {
      console.log("constant.freeUSBLimit", constant.constant.freeUSBLimit, constant.constant.network.Arbitrium)
      await coinMint(req.body.account, constant.constant.freeUSBLimit, constant.constant.network.Arbitrium)
      await coinMint(req.body.account, constant.constant.freeUSBLimit, constant.constant.network.XDC)

      // send some testing coin
    }
    return { data: newWallet, message: "Wallet document with the given account does not exist, so create it." }
  }
};

/**
 * Transfers tokens from one wallet to another.
 * @param {Object} req - The request object containing transfer details.
 * @returns {Object} The transaction hash of the transfer.
 */
transferTokens = async (req) => {

  let networkInfo = NETWORKS[req.body.network]
  let web3Instance = getWebInstance(req.body.network)

  const body = _.pick(req.body, [
    "signature",
    "toAddress",
    "amount",
    "nonce",
    "senderAddress",
    "originalAmount",
    "transNotes",
    "network"
  ]);



  if (!isValidEthereumAddress(body.toAddress))
    throw new apiError(
      errorMessages.ADMIN.INVALID_WALLET_ADDRESS("Recipient"),
      400
    );

  const gasPrice = (await getGasPrice(web3Instance)) * 2;
  const nonce = await getNonce(networkInfo.fundingAddress, web3Instance);


  const encoded_tx = await transferPreSignedHex(
    body.signature,
    body.toAddress,
    parseInt(body.amount),
    parseInt(body.nonce),
    networkInfo.contractAddress,
    web3Instance
  );
  // Construct transaction object
  let estimateTransactionObject = {
    nonce: web3Instance.utils.toHex(nonce),
    from: networkInfo.fundingAddress,
    gasPrice: web3Instance.utils.toHex(gasPrice),
    to: networkInfo.contractAddress,
    data: encoded_tx,
  };


  const gasLimit = await web3Instance.eth.estimateGas(estimateTransactionObject);
  let transactionObject = {
    nonce: web3Instance.utils.toHex(nonce),
    from: networkInfo.fundingAddress,
    gasPrice: web3Instance.utils.toHex(gasPrice),
    gasLimit: web3Instance.utils.toHex(gasLimit),
    to: networkInfo.contractAddress,
    data: encoded_tx,
  };

  const hash = await signAndSendTransaction(transactionObject, networkInfo.fundingKey, web3Instance);

  // Send notification to the recipient
  let token = await walletModel.findOne({ account: body.toAddress });

  if (token) {
    let receiveTokenArray = token.tokenArray;
    for (var i = 0; i < receiveTokenArray.length; i++) {
      if (receiveTokenArray[i].token)
        sendNotificationService(
          receiveTokenArray[i].token,
          `You received ${body.originalAmount} USB from ${body?.senderAddress}`,
          "Received USB",
          "",
          { address: body.toAddress }
        );
    }
  }

  let transactionFound = await transactionModel.findOne({ transactionHash: hash.transactionHash })
  if (transactionFound && body.transNotes) {
    console.log("inside abababa")
    await transactionModel.updateOne(
      { _id: transactionFound._id }, // Filter by wallet address and network name
      { $set: { transactionNotes: body.transNotes, amountToSend: body.amount / TOKEN_DECIMAL, } } // Reset the reward amount on staking to zero
    );
  }
  else {
    let transaction = {
      senderAddress: body.senderAddress,
      receiverAddress: body.toAddress,
      amountToSend: body.amount / TOKEN_DECIMAL,
      transactionHash: hash.transactionHash,
      sendDate: new Date(),
      transactionNotes: body.transNotes,
      network: body.network
    };
    const newTransaction = new transactionModel(transaction);
    await newTransaction.save();
  }
  return { txnHash: hash };
};

/**
 * Retrieves the transaction list for a given wallet address.
 * @param {Object} req - The request object containing the wallet address.
 * @returns {Object} The list of transactions associated with the wallet.
 */
transactionsList = async (req) => {
  const { walletAddress, network } = req.body;

  let wallet = await transactionModel.find({
    $and: [
      {
        $or: [
          { senderAddress: walletAddress },
          { receiverAddress: walletAddress },
        ],
      },
      {
        $or: [
          { transactionType: "Transfer" },
          { transactionType: "Staking" },
          { transactionType: "Free Mint" }
        ],
      },
      { network: network },
    ],
  }).sort({ "timestamps.created_At": -1 });

  return { wallet };
};

/**
 * Retrieves the limited transaction list for a given wallet address.
 * @param {Object} req - The request object containing the wallet address.
 * @returns {Object} The limited list of transactions associated with the wallet.
 */
transactionsListWithLimit = async (req) => {
  const { walletAddress, network } = req.body;

  let wallet = await transactionModel
    .find({
      $and: [
        {
          $or: [
            { senderAddress: walletAddress },
            { receiverAddress: walletAddress },
          ],
        },
        {
          $or: [
            { transactionType: "Transfer" },
            { transactionType: "Staking" },
            { transactionType: "Free Mint" }
          ],
        },
        { network: network },
      ],
    })
    .sort({ "timestamps.created_At": -1 })
    .limit(5);

  return { wallet };
};

/**
 * Updates the status of a transaction.
 * @param {Object} req - The request object containing wallet address, transaction hash, and status.
 */
updateTransactionStatus = async (req) => {

  const { walletAddress, transactionHash, status } = req.body;
  console.log("ccccc", walletAddress, transactionHash, status)
  let wallet = await transactionModel.findOne({
    $and: [
      {
        $or: [
          { senderAddress: walletAddress },
          { receiverAddress: walletAddress },
        ],
      },
      {
        $or: [
          { transactionType: "Transfer" },
          { transactionType: "Staking" },
          { transactionType: "Free Mint" },
        ],
      },
      { transactionHash: transactionHash },
    ],
  });
  console.log("wallet", wallet)


  if (!wallet) throw new apiError(errorMessages.GENERIC_ERROR.RECORD_NOT_FOUND(transactionHash));
  if (wallet.transactionStatus === "Success") return;

  if (status === 1) {
    console.log("Found")
    wallet.transactionStatus = "Success";
  } else if (status === 0) {
    wallet.transactionStatus = "Fail";
  }
  wallet.save();
  return;
};



mintCoin = async (req) => {


  let gasPrice = (await getGasPrice()) * 2;
  const nonce = await web3.eth.getTransactionCount(FUNDING_ADDRESS);
  const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

  let tx1 = await contract.methods.mint(
    req.body.walletAddress,
    parseInt(req.body.amount * TOKEN_DECIMAL)
  );
  const encodedTx = tx1.encodeABI();

  // Construct transaction object
  let estimateTransactionObject = {
    nonce: global.web3.utils.toHex(nonce),
    from: FUNDING_ADDRESS,
    gasPrice: global.web3.utils.toHex(gasPrice),
    to: CONTRACT_ADDRESS,
    data: encodedTx,
  };

  const gasLimit = await web3.eth.estimateGas(estimateTransactionObject);

  let transactionObject = {
    nonce: web3.utils.toHex(nonce),
    from: FUNDING_ADDRESS,
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit),
    to: CONTRACT_ADDRESS,
    data: encodedTx,

  };
  await signAndSendTransactionOnPurchase(transactionObject, FUNDING_KEY);
  return 'Coin send successfully'


}



getFreeCoin = async (req) => {

  const { walletAddress, amount } = req.body;

  if (!isValidEthereumAddress(walletAddress))
    throw new apiError(
      errorMessages.ADMIN.INVALID_WALLET_ADDRESS("Wallet"),
      400
    );

  const existingWallet = await walletModel.findOne({
    account: walletAddress,
  });


  if (!existingWallet) throw new apiError(errorMessages.ADMIN.WALLET_NOT_FOUND_ERROR(walletAddress), 400)
  if (amount > constant.constant.freeUSBLimit) throw new apiError(errorMessages.ADMIN.MAX_FREE_COIN_LIMIT_ERROR(constant.constant.freeUSBLimit))
  if ((amount + existingWallet.freeUSBCoinsBalance) > constant.constant.freeUSBLimit) throw new apiError(errorMessages.ADMIN.REACHED_LIMIT_ERROR(constant.constant.freeUSBLimit, existingWallet.freeUSBCoinsBalance, constant.constant.freeUSBLimit - existingWallet.freeUSBCoinsBalance))



  let gasPrice = (await getGasPrice()) * 2;

  const nonce = await getNonce(FUNDING_ADDRESS);
  const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

  console.log("send amount", req.body.walletAddress, parseInt(req.body.amount * TOKEN_DECIMAL))

  let tx1 = await contract.methods.mint(
    req.body.walletAddress,
    parseInt(req.body.amount * TOKEN_DECIMAL)
  );
  const encodedTx = tx1.encodeABI();
  console.log("encodedTx", encodedTx)
  // Construct transaction object
  let estimateTransactionObject = {
    nonce: global.web3.utils.toHex(nonce),
    from: "0x23F6b853d75f34F0A16dc97E4A2827cE8aA9A7C7",
    gasPrice: global.web3.utils.toHex(gasPrice),
    to: "0x24c8479b8af9742c5160e0c29197e87a584cfe99",
    data: encodedTx,
  };


  const gasLimit = await web3.eth.estimateGas(estimateTransactionObject);

  let transactionObject = {
    nonce: web3.utils.toHex(nonce),
    from: FUNDING_ADDRESS,
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit),
    to: CONTRACT_ADDRESS,
    data: encodedTx,

  };

  await signAndSendTransactionOnPurchase(transactionObject, FUNDING_KEY);

  //store token amount in db
  await walletModel.updateOne({ _id: existingWallet._id }, {
    $set: { freeUSBCoinsBalance: existingWallet.freeUSBCoinsBalance + amount }
  });
  return 'Coin send successfully'
}



withdrawToken = async (req) => {
  console.log("ccccc", req.body)

  let networkInfo = NETWORKS[req.body.network]
  let web3Instance = getWebInstance(req.body.network)
  const gasPrice = (await getGasPrice(web3Instance)) * 2;
  const nonce = await getNonce(networkInfo.fundingAddress, web3Instance);


  const contract = new web3.eth.Contract(ABI, networkInfo.contractAddress);


  let tx1 = await contract.methods.mint(
    req.body.walletAddress,
    parseInt(req.body.amount * TOKEN_DECIMAL)
  );
  const encodedTx = tx1.encodeABI();

  // Construct transaction object
  let estimateTransactionObject = {
    nonce: web3Instance.utils.toHex(nonce),
    from: networkInfo.fundingAddress,
    gasPrice: web3Instance.utils.toHex(gasPrice),
    to: networkInfo.contractAddress,
    data: encodedTx,
  };

  const gasLimit = await web3Instance.eth.estimateGas(estimateTransactionObject);

  let transactionObject = {
    nonce: web3Instance.utils.toHex(nonce),
    from: networkInfo.fundingAddress,
    gasPrice: web3Instance.utils.toHex(gasPrice),
    gasLimit: web3Instance.utils.toHex(gasLimit),
    to: networkInfo.contractAddress,
    data: encodedTx,

  };

  const data = await signAndSendTransactionOnPurchase(transactionObject, networkInfo.fundingKey, web3Instance);
  await stakeModel.updateMany(
    { wallet: req.body.walletAddress, network: networkInfo.name }, // Filter by wallet address and network name
    { $set: { rewardAmountOnStaking: 0 } } // Reset the reward amount on staking to zero
  );
  let transaction = {
    senderAddress: networkInfo.fundingAddress,
    receiverAddress: req.body.walletAddress,
    amountToSend: req.body.amount,
    transactionHash: data.hash.transactionHash,
    sendDate: new Date(),
    network: req.body.network,
    transactionType: "Staking"
  };

  let transactionFound = await transactionModel.findOne({ transactionHash: data.hash.transactionHash })
  let newTransaction
  if (transactionFound) {
    newTransaction = await transactionModel.updateOne(
      { _id: transactionFound._id }, // Filter by wallet address and network name
      { $set: { transactionType: "Staking", amountToSend: req.body.amount } } // Reset the reward amount on staking to zero
    );
  }
  else {
    newTransaction = new transactionModel(transaction);
    await newTransaction.save();
  }

  return newTransaction

}



// Export the controller functions
module.exports = {
  createUserWallet,
  addWallet,
  transferTokens,
  transactionsList,
  transactionsListWithLimit,
  updateTransactionStatus,
  mintCoin,
  getFreeCoin,
  withdrawToken
};
