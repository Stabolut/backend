// Importing the walletService module which contains functions related to wallet management
const wallet = require("../service/walletService");

// Importing the sendSuccessResponse function from the responses utility module
const { sendSuccessResponse } = require("../utils/responses");

// Importing infoMessages constant from the messages constants module
const { infoMessages } = require("../constants/messages");

// Function to create a new wallet for a user
const createWallet = async (req, res) => {
  const userWallet = await wallet.createUserWallet();
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_CREATED_SUCCESSFULLY("Wallet"),
    200,
    userWallet
  );
};

// Function to add a wallet
const addWallet = async (req, res) => {
  const data = await wallet.addWallet(req);
  return sendSuccessResponse(res, data.message, 200, data.data);
};

// Function to transfer tokens
const transferTokens = async (req, res) => {
  const transferHash = await wallet.transferTokens(req);
  return sendSuccessResponse(
    res,
    infoMessages.WALLET.TOKEN_TRANSFER_SUCCESSFULLY,
    200,
    transferHash
  );
};

// Function to get transactions list
const transactionsList = async (req, res) => {
  const transactionsList = await wallet.transactionsList(req);
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Transaction list"),
    200,
    transactionsList
  );
};

// Function to get transactions list with limit
const transactionsListWithLimit = async (req, res) => {
  const transactionsList = await wallet.transactionsListWithLimit(req);
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Transaction list"),
    200,
    transactionsList
  );
};

// Function to update transaction status
const updateTransactionStatus = async (req, res) => {
  await wallet.updateTransactionStatus(req);
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_UPDATED_SUCCESSFULLY("Transaction status"),
    200
  );
};

// Function to get user by wallet
const getUserByWallet = async (req, res) => {
  const data = await wallet.getUserByWallet(req);
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("User"),
    200,
    data
  );
};

// Function to mint coin
const mintCoin = async (req, res) => {
  let msg = await wallet.mintCoin(req);
  return sendSuccessResponse(
    res,
    msg,
    200
  );
};

// Function to get free coin
const getFreeCoin = async (req, res) => {
  let msg = await wallet.getFreeCoin(req);
  return sendSuccessResponse(
    res,
    msg,
    200
  );
};

// Function to withdraw token
const withdrawToken = async (req, res) => {
  await wallet.withdrawToken(req);
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
