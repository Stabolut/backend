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
const { CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY, ABI, TOKEN_DECIMAL } = require("../config");
const _ = require("lodash");
const { createWallet, signAndSendTransactionOnPurchase } = require("../utils/wallet");
const apiError = require("../error/apiError");
const constant = require("../constants/constant");
const { generateReferralCode, generateReferralLink } = require("../utils/helperMethod");
const stakeModel = require("../models/stakeModel");

/**
 * Creates a new wallet for a user.
 * @returns {Object} The newly created wallet object.
 */
const createUserWallet = async () => {
  const wallet = await createWallet();
  return wallet;
};

/**
 * Adds a new wallet or token to an existing wallet.
 * @param {Object} req - The request object containing account and token details.
 * @returns {string} A message indicating the success or failure of the operation.
 */
const addWallet = async (req) => {

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
      referralWallet: { $regex: new RegExp(`^${req.body.account}$`, 'i') },
    });
    if (referralExist)

      throw new apiError(
        "It looks like you've already made a referral. If you have another code to enter, please note that you can only make one referral per account. If you need assistance, feel free to reach out",
        400
      );


    const referral = new referralModel({
      referenceWallet: referralUser.account,
      referralWallet: req.body.account,

    });
    await referral.save();
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
      await existingWallet.save();
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
    await newWallet.save();
    return { data: newWallet, message: "Wallet document with the given account does not exist, so create it." }
  }
};

/**
 * Transfers tokens from one wallet to another.
 * @param {Object} req - The request object containing transfer details.
 * @returns {Object} The transaction hash of the transfer.
 */
const transferTokens = async (req) => {
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

  const gasPrice = (await getGasPrice()) * 2;
  const nonce = await getNonce(FUNDING_ADDRESS);
  const encoded_tx = await transferPreSignedHex(
    body.signature,
    body.toAddress,
    parseInt(body.amount),
    parseInt(body.nonce)
  );

  // Construct transaction object
  let estimateTransactionObject = {
    nonce: global.web3.utils.toHex(nonce),
    from: FUNDING_ADDRESS,
    gasPrice: global.web3.utils.toHex(gasPrice),
    to: CONTRACT_ADDRESS,
    data: encoded_tx,
  };

  const gasLimit = await web3.eth.estimateGas(estimateTransactionObject);

  let transactionObject = {
    nonce: global.web3.utils.toHex(nonce),
    from: FUNDING_ADDRESS,
    gasPrice: global.web3.utils.toHex(gasPrice),
    gasLimit: global.web3.utils.toHex(gasLimit),
    to: CONTRACT_ADDRESS,
    data: encoded_tx,
  };

  const hash = await signAndSendTransaction(transactionObject, FUNDING_KEY);

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

  // Save transaction details
  let findTransaction = await transactionModel.findOne({
    senderAddress: { $regex: new RegExp(`^${body.senderAddress}$`, 'i') },
    receiverAddress: { $regex: new RegExp(`^${body.toAddress}$`, 'i') },
    amountToSend: body.amount / TOKEN_DECIMAL,
    transactionHash: hash.transactionHash,
  });

  if (findTransaction) {

    // Update the transaction if it already exists and `transactionNotes` is provided
    if (body.transNotes && !findTransaction.transactionNotes) {

      findTransaction.transactionNotes = body.transNotes;
      await findTransaction.save();
    }
  } else {

    // Create a new transaction if it doesn't exist
    let transaction = {
      senderAddress: body.senderAddress,
      receiverAddress: body.toAddress,
      amountToSend: body.amount / TOKEN_DECIMAL,
      transactionHash: hash.transactionHash,
      sendDate: new Date(),
      transactionNotes: body.transNotes,
      network: body.network || "Arbitrum"
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
const transactionsList = async (req) => {
  const { walletAddress } = req.body;

  let wallet = await transactionModel.find({
    $and: [
      {
        $or: [
          { senderAddress: walletAddress },
          { receiverAddress: walletAddress },
        ],
      },
      { transactionType: "Transfer" },
    ],
  }).sort({ "timestamps.created_At": -1 });

  return { wallet };
};

/**
 * Retrieves the limited transaction list for a given wallet address.
 * @param {Object} req - The request object containing the wallet address.
 * @returns {Object} The limited list of transactions associated with the wallet.
 */
const transactionsListWithLimit = async (req) => {
  const { walletAddress } = req.body;

  let wallet = await transactionModel.find({
    $and: [
      {
        $or: [
          { senderAddress: walletAddress },
          { receiverAddress: walletAddress },
        ],
      },
      { transactionType: "Transfer" },
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
const updateTransactionStatus = async (req) => {

  const { walletAddress, transactionHash, status } = req.body;
  let wallet = await transactionModel.findOne({
    $and: [
      {
        $or: [
          { senderAddress: walletAddress },
          { receiverAddress: walletAddress },
        ],
      },
      { transactionType: "Transfer" },
      { transactionStatus: "Pending" },
      { transactionHash: transactionHash },
    ],
  });

  if (!wallet)
    throw new apiError(
      errorMessages.GENERIC_ERROR.RECORD_NOT_FOUND(transactionHash)
    );

  if (status === 1) {
    wallet.transactionStatus = "Success";
  } else if (status === 0) {
    wallet.transactionStatus = "Fail";
  }
  await wallet.save();
  return;
};

const mintCoin = async (req) => {


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



const getFreeCoin = async (req) => {

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

  //store token amount in db
  await walletModel.updateOne({ _id: existingWallet._id }, {
    $set: { freeUSBCoinsBalance: existingWallet.freeUSBCoinsBalance + amount }
  });
  return 'Coin send successfully'


}
const withdrawToken = async (req) => {

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


  await stakeModel.updateMany(
    { wallet: req.body.walletAddress },
    { $set: { rewardAmountOnStaking: 0 } } // Resets balance to zero for all records with the wallet
  );
  return 'Coin withdraw successfully'

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
