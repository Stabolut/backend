// Import the DepositAdminModel to interact with the database
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

// Service function to retrieve deposit address based on query parameters
getDepositAddress = async (req, res) => {
  // Query the database to find the active deposit address based on the provided type
  let depositAddress = await DepositAdminModel.findOne({
    isActive: true, // Filter for active deposit addresses
    type: req.query.type, // Filter based on the type provided in the request query
  });
  // Return the retrieved deposit address
  return depositAddress;
};

purchaseUSBWithEther = async (req, res) => {
  let despositAmount;

  if (!isValidEthereumAddress(req.body.usbAddress))
    throw new ApiError(
      ErrorMessages.ADMIN.INVALID_WALLET_ADDRESS("Receipent"),
      400
    );

  let resp = await web3Eth.eth.getTransactionReceipt(req.body.hash);
  let tx = await web3Eth.eth.getTransaction(req.body.hash);

  if (!resp)
    throw new ApiError(ErrorMessages.ADMIN.TRANSACTION_PENDING_ERROR, 400);

  if (resp && resp.status === false)
    throw new ApiError(ErrorMessages.ADMIN.TRANSACTION_PENDING_ERROR, 400);

  despositAmount = tx.value;

  //     let despositAmount, usdRate
  let admin = await DepositAdminModel.findOne({
    type: "eth",
    isActive: true,
  });

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

  if (resp.to !== admin.depositAddress.toLowerCase())
    throw new ApiError(
      ErrorMessages.ADMIN.INVALID_HASH(
        ErrorMessages.ADMIN.INVALID_HASH(admin.depositAddres)
      ),
      400
    );

  const response = await axios.get(ETH_TO_USD_URL);

  let usdRate = response.data.ethereum.usd;

  const gasPrice = await web3Usb.eth.getGasPrice();
  const gasLimit = 21000000;
  const nonce = await web3Usb.eth.getTransactionCount(FUNDING_ADDRESS);
  const contract = new web3Usb.eth.Contract(ABI, CONTRACT_ADDRESS);
  let tx1 = await contract.methods.mint(
    req.body.usbAddress,
    parseInt((despositAmount / 1e18) * usdRate * 1e2)
  );
  const encoded_tx = tx1.encodeABI();

  let transactionObject = {
    nonce: web3Usb.utils.toHex(nonce),
    from: FUNDING_ADDRESS,
    gasPrice: web3Usb.utils.toHex(gasPrice),
    gasLimit: web3Usb.utils.toHex(gasLimit),
    to: CONTRACT_ADDRESS,
    data: encoded_tx,
  };
  const hash = await signAndSendTransaction(transactionObject, FUNDING_KEY);

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

purchaseUSBWithBtc = async (req, res) => {
  let despositAmount, usdRate;

  let admin = await DepositAdminModel.findOne({
    type: "btc",
    isActive: true,
  });
  if (!isValidEthereumAddress(req.body.usbAddress))
    throw new ApiError(
      ErrorMessages.ADMIN.INVALID_WALLET_ADDRESS("Receipent"),
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
          ErrorMessages.ADMIN.INVALID_HASH(admin.depositAddres)
        ),
        400
      );
    }
    if (userFind) {
      const response = await axios.get(BTC_TO_USD_URL);
      despositAmount = receiedTransactionObject.value / 100000000;
      usdRate = response.data.bitcoin.usd;

      // now we will mint coin
      const gasPrice = await web3Usb.eth.getGasPrice();
      const gasLimit = 21000000;

      const nonce = await web3Usb.eth.getTransactionCount(FUNDING_ADDRESS);

      const contract = new web3Usb.eth.Contract(ABI, CONTRACT_ADDRESS);
      let tx1 = await contract.methods.mint(
        req.body.usbAddress,
        parseInt(despositAmount * usdRate * 1e2)
      );

      const encoded_tx = tx1.encodeABI();

      let transactionObject = {
        nonce: web3Usb.utils.toHex(nonce),
        from: FUNDING_ADDRESS,
        gasPrice: web3Usb.utils.toHex(gasPrice),
        gasLimit: web3Usb.utils.toHex(gasLimit),
        to: CONTRACT_ADDRESS,
        data: encoded_tx,
      };

      const hash = await signAndSendTransaction(transactionObject, FUNDING_KEY);

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
    throw new ApiError(ErrorMessages.ADMIN.BTC_PEDNING_HASH_ERROR, 400);
  }
};
// Export the controller function
module.exports = {
  getDepositAddress,
  purchaseUSBWithEther,
  purchaseUSBWithBtc,
};
