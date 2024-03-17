// Import required modules and models
const { ApiError } = require("@google-cloud/storage/build/src/nodejs-common");
const DepositAdminModel = require("../models/DepositAdminAddressesModel");
const PurchasenModel = require("../models/PurchaseModel");
const { ErrorMessages } = require("../constants/errors");

const {
  ETH_RPC_URL,
  RPC_URI,
  ETH_TO_USD_URL,
  BTC_TO_USD_URL,
  ABI,
  CONTRACT_ADDRESS,
  FUNDING_ADDRESS,
  FUNDING_KEY,
  BITPAY_URL,
} = require("../config");

const _ = require("lodash");
const axios = require("axios");
const {
  isValidEthereumAddress,
  signAndSendTransaction,
} = require("../utils/wallet");
const Web3 = require("web3");
const web3Eth = new Web3(ETH_RPC_URL);
const web3Usb = new Web3(RPC_URI);

/**
 * Retrieves the active deposit address based on the type provided in the request query.
 * @param {object} req - The request object containing the query parameter for the type.
 * @returns {object} The active deposit address.
 */
const getDepositAddress = async (req) => {
  // Query the database to find the active deposit address based on the provided type
  let depositAddress = await DepositAdminModel.findOne({
    isActive: true, // Filter for active deposit addresses
    type: req.query.type, // Filter based on the type provided in the request query
  });
  // Return the retrieved deposit address
  return depositAddress;
};

/**
 * Purchases USB coins using Ethereum.
 * @param {object} req - The request object containing the transaction details.
 * @throws {ApiError} If the recipient address is invalid or if the transaction is pending.
 * @returns {string} Confirmation message upon successful purchase.
 */
const purchaseUSBWithEther = async (req) => {
  let despositAmount;

  if (!isValidEthereumAddress(req.body.usbAddress))
    throw new ApiError(
      ErrorMessages.ADMIN.INVALID_WALLET_ADDRESS("Recipient"),
      400
    );

  let resp = await web3Eth.eth.getTransactionReceipt(req.body.hash);
  let tx = await web3Eth.eth.getTransaction(req.body.hash);

  if (!resp)
    throw new ApiError(ErrorMessages.ADMIN.TRANSACTION_PENDING_ERROR, 400);

  if (resp && resp.status === false)
    throw new ApiError(ErrorMessages.ADMIN.TRANSACTION_PENDING_ERROR, 400);

  despositAmount = tx.value;

  // Retrieve admin deposit address and check for existing hash
  let admin = await DepositAdminModel.findOne({
    type: "eth",
    isActive: true,
  });

  let checkHashExist = await PurchasenModel.findOne({
    transactionHash: req.body.hash,
  });

  // Validate transaction hash and recipient address
  if (checkHashExist)
    throw new ApiError(
      ErrorMessages.ADMIN.HASH_ALREADY_USED_ERROR(
        checkHashExist.usbSend,
        checkHashExist.purchaseUSBWallet
      ),
      400
    );

  if (resp.to !== admin.depositAddress.toLowerCase())
    throw new ApiError(
      ErrorMessages.ADMIN.INVALID_HASH(
        ErrorMessages.ADMIN.INVALID_HASH(admin.depositAddress)
      ),
      400
    );

  // Fetch USD rate for conversion
  const response = await axios.get(ETH_TO_USD_URL);
  let usdRate = response.data.ethereum.usd;

  // Calculate gas price, gas limit, and nonce for transaction
  const gasPrice = await web3Usb.eth.getGasPrice();
  const gasLimit = 21000000;
  const nonce = await web3Usb.eth.getTransactionCount(FUNDING_ADDRESS);

  // Create contract instance and encode transaction data
  const contract = new web3Usb.eth.Contract(ABI, CONTRACT_ADDRESS);
  let tx1 = await contract.methods.mint(
    req.body.usbAddress,
    parseInt((despositAmount / 1e18) * usdRate * 1e2)
  );
  const encoded_tx = tx1.encodeABI();

  // Build transaction object
  let transactionObject = {
    nonce: web3Usb.utils.toHex(nonce),
    from: FUNDING_ADDRESS,
    gasPrice: web3Usb.utils.toHex(gasPrice),
    gasLimit: web3Usb.utils.toHex(gasLimit),
    to: CONTRACT_ADDRESS,
    data: encoded_tx,
  };

  // Sign and send the transaction
  const hash = await signAndSendTransaction(transactionObject, FUNDING_KEY);

  // Save purchase transaction details
  let purchase = new PurchasenModel({
    transactionHash: req.body.hash,
    purchaseSuccessStatus: true,
    usbSend: ((despositAmount / 1e18) * usdRate).toFixed(2),
    receiveAmount: despositAmount / 1e18,
    type: "ether",
    usdRate,
    purchaseUSBWallet: req.body.usbAddress,
    transactionHashUSB: hash.transactionHash,
  });
  await purchase.save();

  return `Your purchase of ${((despositAmount / 1e18) * usdRate).toFixed(
    2
  )} USB coins has been completed successfully. The USB coins have been sent to the wallet address you provided: ${
    req.body.usbAddress
  }.`;
};

/**
 * Purchases USB coins using Bitcoin.
 * @param {object} req - The request object containing the transaction details.
 * @throws {ApiError} If the recipient address is invalid, the hash is already used, or the transaction is pending.
 * @returns {string} Confirmation message upon successful purchase.
 */
const purchaseUSBWithBtc = async (req) => {
  let despositAmount, usdRate;

  let admin = await DepositAdminModel.findOne({
    type: "btc",
    isActive: true,
  });
  if (!isValidEthereumAddress(req.body.usbAddress))
    throw new ApiError(
      ErrorMessages.ADMIN.INVALID_WALLET_ADDRESS("Recipient"),
      400
    );

  let checkHashExist = await PurchasenModel.findOne({
    transactionHash: req.body.hash,
  });
  if (checkHashExist)
    throw new ApiError(
      ErrorMessages.ADMIN.HASH_ALREADY_USED_ERROR(
        checkHashExist.usbSend,
        checkHashExist.purchaseUSBWallet
      ),
      400
    );

  let response = await axios.get(`${BITPAY_URL}/tx/${req.body.hash}`);

  if (response.data.confirmations > 1) {
    let { data } = await axios.get(`${BITPAY_URL}/tx/${req.body.hash}/coins`);
    let receiedTransactionObject = {};
    let userFind = false;

    for (var i = 0; i < data.outputs.length; i++) {
      if (admin.depositAddress === data.outputs[i].address) {
        receiedTransactionObject = data.outputs[i];
        userFind = true;
        break;
      }
    }

    if (!userFind) {
      throw new ApiError(
        ErrorMessages.ADMIN.INVALID_HASH(
          ErrorMessages.ADMIN.INVALID_HASH(admin.depositAddress)
        ),
        400
      );
    }
    if (userFind) {
      const response = await axios.get(BTC_TO_USD_URL);
      despositAmount = receiedTransactionObject.value / 100000000;
      usdRate = response.data.bitcoin.usd;

      // Calculate gas price, gas limit, and nonce for transaction
      const gasPrice = await web3Usb.eth.getGasPrice();
      const gasLimit = 21000000;
      const nonce = await web3Usb.eth.getTransactionCount(FUNDING_ADDRESS);

      // Create contract instance and encode transaction data
      const contract = new web3Usb.eth.Contract(ABI, CONTRACT_ADDRESS);
      let tx1 = await contract.methods.mint(
        req.body.usbAddress,
        parseInt(despositAmount * usdRate * 1e2)
      );

      const encoded_tx = tx1.encodeABI();

      // Build transaction object
      let transactionObject = {
        nonce: web3Usb.utils.toHex(nonce),
        from: FUNDING_ADDRESS,
        gasPrice: web3Usb.utils.toHex(gasPrice),
        gasLimit: web3Usb.utils.toHex(gasLimit),
        to: CONTRACT_ADDRESS,
        data: encoded_tx,
      };

      // Sign and send the transaction
      const hash = await signAndSendTransaction(transactionObject, FUNDING_KEY);

      // Save purchase transaction details
      let purchase = new PurchasenModel({
        transactionHash: req.body.hash,
        purchaseSuccessStatus: true,
        usbSend: despositAmount * usdRate,
        receiveAmount: despositAmount,
        type: "btc",
        usdRate,
        purchaseUSBWallet: req.body.usbAddress,
        transactionHashUSB: hash.transactionHash,
      });
      await purchase.save();
    }

    return `Your purchase of ${(despositAmount * usdRate).toFixed(
      2
    )} USB coins has been completed successfully. The USB coins have been sent to the wallet address you provided: ${
      req.body.usbAddress
    }.`;
  } else {
    throw new ApiError(ErrorMessages.ADMIN.BTC_PENDING_HASH_ERROR, 400);
  }
};

// Export the controller functions
module.exports = {
  getDepositAddress,
  purchaseUSBWithEther,
  purchaseUSBWithBtc,
};
