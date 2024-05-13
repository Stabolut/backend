// Import necessary modules and models
const { errorMessages } = require("../constants/errors");
const walletModel = require("../models/walletModel");
const { getTokenBalance } = require("../utils/wallet");
const transactionModel = require("../models/transactionModel");
const { isEmpty } = require("lodash")
const { sendNotificationService } = require("../workers/sendNotificationService")
const {
  isValidEthereumAddress,
  getGasPrice,
  getNonce,
  signAndSendTransaction,
  transferPreSignedHex,
} = require("../utils/wallet");
const { CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY, ABI } = require("../config");
const _ = require("lodash");
const { createWallet, signAndSendTransactionOnPurchase } = require("../utils/wallet");
const apiError = require("../error/apiError");
const constant = require("../constants/constant");
const { generateReferralCode, generateReferralLink } = require("../utils/helperMethod");

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
    return { data: newWallet, message: "Wallet document with the given account does not exist, so create it." }
  }
};

/**
 * Transfers tokens from one wallet to another.
 * @param {Object} req - The request object containing transfer details.
 * @returns {Object} The transaction hash of the transfer.
 */
transferTokens = async (req) => {


  const body = _.pick(req.body, [
    "signature",
    "toAddress",
    "amount",
    "nonce",
    "senderAddress",
    "originalAmount",
    "transNotes",
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
          `You received ${body.originalAmount} USB from ${body.senderAddress}`,
          "Received USB",
          "",
          { address: body.toAddress }
        );
    }
  }

  // Save transaction details
  let findTransaction = await transactionModel.findOne({
    senderAddress: body.senderAddress,
    receiverAddress: body.toAddress,
    amountToSend: body.amount / 1e2,
    transactionHash: hash.transactionHash,
  });


  if (!findTransaction) {
    let transaction = {
      senderAddress: body.senderAddress,
      receiverAddress: body.toAddress,
      amountToSend: body.amount / 1e2,
      transactionHash: hash.transactionHash,
      sendDate: new Date(),
      transactionNotes: body.transNotes,
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
transactionsListWithLimit = async (req) => {
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
updateTransactionStatus = async (req) => {

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
    console.log("Found")
    wallet.transactionStatus = "Success";
  } else if (status === 0) {
    wallet.transactionStatus = "Fail";
  }
  wallet.save();
  return;
};



mintCoin = async (req) => {

  let gasLimit = 21000000;
  let gasPrice = (await getGasPrice()) * 2;
  const nonce = await web3.eth.getTransactionCount(FUNDING_ADDRESS);
  const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

  let tx1 = await contract.methods.mint(
    req.body.walletAddress,
    parseInt(req.body.amount * 1e2)
  );
  const encoded_tx = tx1.encodeABI();

  let transactionObject = {
    nonce: web3.utils.toHex(nonce),
    from: FUNDING_ADDRESS,
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit),
    to: CONTRACT_ADDRESS,
    data: encoded_tx,

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


  let gasLimit = 21000000;
  let gasPrice = (await getGasPrice()) * 2;
  const nonce = await web3.eth.getTransactionCount(FUNDING_ADDRESS);
  const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

  let tx1 = await contract.methods.mint(
    req.body.walletAddress,
    parseInt(req.body.amount * 1e2)
  );
  const encoded_tx = tx1.encodeABI();

  let transactionObject = {
    nonce: web3.utils.toHex(nonce),
    from: FUNDING_ADDRESS,
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit),
    to: CONTRACT_ADDRESS,
    data: encoded_tx,

  };
  await signAndSendTransactionOnPurchase(transactionObject, FUNDING_KEY);

  //store token amount in db
  await walletModel.updateOne({ _id: existingWallet._id }, {
    $set: { freeUSBCoinsBalance: existingWallet.freeUSBCoinsBalance + amount }
  });
  return 'Coin send successfully'


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
  getFreeCoin
};
