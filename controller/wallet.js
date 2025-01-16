// Importing the walletService module which contains functions related to wallet management
const wallet = require("../service/walletService");

// Importing the sendSuccessResponse function from the responses utility module
const { sendSuccessResponse } = require("../utils/responses");

// Importing infoMessages constant from the messages constants module
const { infoMessages } = require("../constants/messages");

// Function to create a new wallet for a user
createWallet = async (req, res) => {
  // Call the createUserWallet function from the walletService module and await its response
  const userWallet = await wallet.createUserWallet();

  // Send a success response with the message indicating successful creation of wallet and the user wallet data
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_CREATED_SUCCESSFULLY("Wallet"),
    200,
    userWallet
  );
};

// Function to add a wallet
addWallet = async (req, res) => {
  // Call the addWallet function from the walletService module and await its response
  const data = await wallet.addWallet(req);
  // Send a success response with the message received from adding a wallet
  return sendSuccessResponse(res, data.message, 200, data.data);
};

// Function to transfer tokens
transferTokens = async (req, res) => {
  // Call the transferTokens function from the walletService module and await its response
  const transferHash = await wallet.transferTokens(req);

  // Send a success response with the message indicating successful token transfer and the transfer hash
  return sendSuccessResponse(
    res,
    infoMessages.WALLET.TOKEN_TRANSFER_SUCCESSFULLY,
    200,
    transferHash
  );
};

// Function to get transactions list
transactionsList = async (req, res) => {
  // Call the transactionsList function from the walletService module and await its response
  const transactionsList = await wallet.transactionsList(req);

  // Send a success response with the message indicating successful retrieval of transaction list and the list of transactions
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Transaction list"),
    200,
    transactionsList
  );
};

// Function to get transactions list with limit
transactionsListWithLimit = async (req, res) => {
  // Call the transactionsListWithLimit function from the walletService module and await its response
  const transactionsList = await wallet.transactionsListWithLimit(req);

  // Send a success response with the message indicating successful retrieval of transaction list and the list of transactions
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Transaction list"),
    200,
    transactionsList
  );
};

// Function to update transaction status
updateTransactionStatus = async (req, res) => {
  // Call the updateTransactionStatus function from the walletService module and await its response
  await wallet.updateTransactionStatus(req);

  // Send a success response with the message indicating successful update of transaction status
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_UPDATED_SUCCESSFULLY("Transaction status"),
    200
  );
};

// Function to get user by wallet
getUserByWallet = async (req, res) => {
  // Call the getUserByWallet function from the walletService module and await its response
  await wallet.getUserByWallet(req);

  // Send a success response with the message indicating successful retrieval of user by wallet
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_UPDATED_SUCCESSFULLY("Transaction status"),
    200
  );
};

// Function to get user by wallet
mintCoin = async (req, res) => {
  // Call the getUserByWallet function from the walletService module and await its response
  let msg = await wallet.mintCoin(req);

  // Send a success response with the message indicating successful retrieval of user by wallet
  return sendSuccessResponse(
    res,
    msg,
    200
  );
};

// Function to get user by wallet
getFreeCoin = async (req, res) => {
  // Call the getUserByWallet function from the walletService module and await its response
  let msg = await wallet.getFreeCoin(req);

  // Send a success response with the message indicating successful retrieval of user by wallet
  return sendSuccessResponse(
    res,
    msg,
    200
  );
};

withdrawToken

// Function to get user by wallet
withdrawToken = async (req, res) => {
  console.log("i am hit thereee",req.body)
  // Call the getUserByWallet function from the walletService module and await its response
  await wallet.withdrawToken(req);

  // Send a success response with the message indicating successful retrieval of user by wallet
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.WITHDRAW_SUCCESSFULLY,
    200
  );
};

// Exporting the functions so they can be used elsewhere
module.exports = {
  createWallet,
  addWallet,
  transferTokens,
  transactionsList,
  transactionsListWithLimit,
  updateTransactionStatus,
  getUserByWallet,
  mintCoin,
  getFreeCoin,
  withdrawToken
};
