// Import necessary modules and models
const { ApiError } = require("@google-cloud/storage/build/src/nodejs-common");
const { errorMessages } = require("../constants/errors");
const WalletModel = require("../models/walletModel");
const { getTokenBalance } = require("../utils/wallet");
const TransactionModel = require("../models/TransactionModel");
const { sendNotification } = require("../NotificationService");
const {
  isValidEthereumAddress,
  getGasPrice,
  getNonce,
  signAndSendTransaction,
  transferPreSignedHex,
} = require("../utils/wallet");
const { CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY } = require("../config");
const _ = require("lodash");
const { createWallet } = require("../utils/wallet");

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
  const existingWallet = await WalletModel.findOne({
    account: req.body.account,
  });

  if (existingWallet) {
    if (existingWallet.tokenArray.some((t) => t.token === req.body.token)) {
      return "Token already exists in the TokenArray";
    } else {
      existingWallet.tokenArray.push({ token: req.body.token });
      existingWallet.save();
      return "Token does not exist in the TokenArray, so add it.";
    }
  } else {
    let balance = await getTokenBalance(req.body.account);
    const newWallet = new WalletModel({
      account: req.body.account,
      balance: parseFloat(balance / 1e2),
      tokenArray: [{ token: req.body.token }],
    });
    newWallet.save();
    return "Wallet document with the given account does not exist, so create it.";
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
    throw new ApiError(
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
  let token = await WalletModel.findOne({ account: body.toAddress });

  if (token) {
    let receiveTokenArray = token.tokenArray;
    for (var i = 0; i < receiveTokenArray.length; i++) {
      if (receiveTokenArray[i].token)
        sendNotification(
          receiveTokenArray[i].token,
          `You received ${body.originalAmount} USB from ${body.senderAddress}`,
          "Received USB",
          "",
          { address: body.toAddress }
        );
    }
  }

  // Save transaction details
  let findTransaction = await TransactionModel.findOne({
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

    const newTransaction = new TransactionModel(transaction);
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

  let wallet = await TransactionModel.find({
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

  let wallet = await TransactionModel.find({
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
  let wallet = await TransactionModel.findOne({
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
    throw new ApiError(
      errorMessages.GENERIC_ERROR.RECORD_NOT_FOUND(transactionHash)
    );

  if (status === 1) {
    wallet.transactionStatus = "Success";
  } else if (status === 0) {
    wallet.transactionStatus = "Fail";
  }
  wallet.save();
  return;
};

// Export the controller functions
module.exports = {
  createUserWallet,
  addWallet,
  transferTokens,
  transactionsList,
  transactionsListWithLimit,
  updateTransactionStatus,
};
