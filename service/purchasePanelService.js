// Import required modules and models
const apiError = require("../error/apiError");
const depositAdminModel = require("../models/depositAdminAddressesModel");
const purchasenModel = require("../models/purchaseModel");
const walletModel = require("../models/walletModel")
const AdminModel = require("../models/AdminModel");
const { errorMessages } = require("../constants/errors");

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
  JWT_SECRET_KEY,
  SESSION_EXPIRES_IN,
} = require("../config");

const _ = require("lodash");
const axios = require("axios");
const {
  isValidEthereumAddress,
  signAndSendTransaction,
  signAndSendTransactionOnPurchase,
  getGasPrice,
} = require("../utils/wallet");
const Web3 = require("web3");
const constant = require("../constants/constant");
const { infoMessages } = require("../constants/messages");
const { response } = require("express");
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

const web3Eth = new Web3(ETH_RPC_URL);
const web3Usb = new Web3(RPC_URI);

/**
 * Retrieves the active deposit address based on the type provided in the request query.
 * @param {object} req - The request object containing the query parameter for the type.
 * @returns {object} The active deposit address.
 */
const getDepositAddress = async (req) => {
  // Query the database to find the active deposit address based on the provided type
  let depositAddress = await depositAdminModel.findOne({
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

  let despositAmount, usdRate, admin
  const { usbAddress, hash, amount } = req.body

  // Validate recipient address
  if (!isValidEthereumAddress(req.body.usbAddress))
    throw new apiError(
      errorMessages.ADMIN.INVALID_WALLET_ADDRESS("Recipient"),
      400
    );

  // Check if transaction hash already exists
  let checkHashExist = await purchasenModel.findOne({
    transactionHash: hash
  });

  if (checkHashExist)
    throw new apiError(
      errorMessages.ADMIN.HASH_ALREADY_USED_ERROR(
        checkHashExist.userUSBWalletAddres
      ),
      400
    );

  // Fetch USD rate for conversion
  try {
    const response = await axios.get(ETH_TO_USD_URL);
    usdRate = response.data.ethereum.usd;
  }
  catch (e) {
    // will get from DB run the service which will save eth rate in DB after sometime
    usdRate = constant.constant.ethToUsdRate

  }
  // Get transaction receipt and details
  let resp = await web3Eth.eth.getTransactionReceipt(req.body.hash);
  let tx = await web3Eth.eth.getTransaction(req.body.hash);
  // Find admin deposit address for validation
  admin = await depositAdminModel.findOne({
    type: constant.constant.currencyType.eth,
    isActive: true,
  });

  if (resp.to !== admin.depositAddress.toLowerCase()) return errorMessages.GENERIC_ERROR.INVALID_HASH(admin.depositAddress)


  // Save initial transaction record
  let purchase = new purchasenModel({
    transactionHash: req.body.hash,
    type: constant.constant.currencyType.eth,
    conversionRate: usdRate,
    userUSBWalletAddres: req.body.usbAddress,
    transferStatus: constant.constant.transferStatus.Processing

  });
  document = await purchase.save();

  // Handle pending transactions
  if (!resp) {

    await purchasenModel.updateOne({ _id: document._id }, {
      $set: { transferStatus: constant.constant.transferStatus.Pending }
    });

    return infoMessages.ADMIN.PURCHASE_CONFIRMATION_MESSAGE((parseFloat(amount) * usdRate).toFixed(2), usbAddress, hash)
  }

  if (resp && resp.status === false) {

    await purchasenModel.updateOne({ _id: document._id }, {
      $set: { transferStatus: constant.constant.transferStatus.Pending }
    });

    return infoMessages.ADMIN.PURCHASE_CONFIRMATION_MESSAGE((parseFloat(amount) * usdRate).toFixed(2), usbAddress, hash)
  }

  despositAmount = tx.value;

  // Calculate gas price, gas limit, and nonce for transaction

  let gasPrice = (await getGasPrice()) * 2;
  const nonce = await web3Usb.eth.getTransactionCount(FUNDING_ADDRESS);

  // Create contract instance and encode transaction data
  const contract = new web3Usb.eth.Contract(ABI, CONTRACT_ADDRESS);

  let mintObject = await contract.methods.mint(
    req.body.usbAddress,
    parseInt((despositAmount / 1e18) * usdRate * 1e2)
  );
  const encodedTx = mintObject.encodeABI();

  // Construct transaction object
  let estimateTransactionObject = {
    nonce: web3Usb.utils.toHex(nonce),
    from: FUNDING_ADDRESS,
    gasPrice: web3Usb.utils.toHex(gasPrice),
    to: CONTRACT_ADDRESS,
    data: encodedTx,
  };

  const gasLimit = await web3.eth.estimateGas(estimateTransactionObject);


  // Build transaction object
  let transactionObject = {
    nonce: web3Usb.utils.toHex(nonce),
    from: FUNDING_ADDRESS,
    gasPrice: web3Usb.utils.toHex(gasPrice),
    gasLimit: web3Usb.utils.toHex(gasLimit),
    to: CONTRACT_ADDRESS,
    data: encodedTx,

  };

  // Sign and send transaction
  let transactionResponse = await signAndSendTransactionOnPurchase(transactionObject, FUNDING_KEY);

  // Handle successful transaction
  if (transactionResponse.status === true) {

    await purchasenModel.updateOne({ _id: document._id }, {
      $set: {
        usbSentAmount: ((despositAmount / 1e18) * usdRate).toFixed(2),
        cryptoReceivedAmount: despositAmount / 1e18,
        transferStatus: constant.constant.transferStatus.Success,
        transactionHashUSB: transactionResponse.hash.transactionHash
      }
    });
    return infoMessages.ADMIN.TRANSFER_USB_CONFIRMATION_ON_PURCHASE(((despositAmount / 1e18) * usdRate).toFixed(2), usbAddress)
  }
  // Handle pending transaction
  await purchasenModel.updateOne({ _id: document._id }, {
    $set: { transferStatus: "Pending" }
  });
  return infoMessages.ADMIN.TRANSFER_USB_PENDING_ON_PURCHASE(((despositAmount / 1e18) * usdRate).toFixed(2), usbAddress)

}

/**
 * Purchases USB coins using Bitcoin.
 * @param {object} req - The request object containing the transaction details.
 * @throws {ApiError} If the recipient address is invalid, the hash is already used, or the transaction is pending.
 * @returns {string} Confirmation message upon successful purchase.
 */
const purchaseUSBWithBtc = async (req) => {


  let depositAmount, usdRate, conversionApiResponse, document
  const { usbAddress, amount, hash } = req.body

  // Validate recipient address
  if (!isValidEthereumAddress(usbAddress))
    throw new apiError(
      errorMessages.ADMIN.INVALID_WALLET_ADDRESS("Recipient"),
      400
    );

  // Check if transaction hash already exists
  let checkHashExist = await purchasenModel.findOne({
    transactionHash: hash,
  });

  if (checkHashExist) throw new apiError(errorMessages.ADMIN.HASH_ALREADY_USED_ERROR(checkHashExist.purchaseUSBWallet), 400);


  // Fetch USD rate for conversion
  try {
    conversionApiResponse = await axios.get(BTC_TO_USD_URL);
    usdRate = conversionApiResponse.data.bitcoin.usd;
  }
  catch (e) {
    // will get from DB run the service which will save btc rate in DB after sometime
    usdRate = constant.constant.btcToUsdRate

  }

  // convert amount from string to float
  depositAmount = parseFloat(amount)


  // inital save data of user transaction and transfer status will be processing if we do pending we have chance of double spending service can also triger and send coin to pending one
  let purchase = new purchasenModel({
    transactionHash: hash,
    type: constant.constant.currencyType.btc,
    conversionRate: usdRate,
    userUSBWalletAddres: usbAddress,
    cryptoReceivedAmount: depositAmount,
    transferStatus: constant.constant.transferStatus.Processing

  });
  document = await purchase.save();


  try {

    response = await axios.get(`${BITPAY_URL}/tx/${hash}`);


  }
  catch (e) {


    await purchasenModel.updateOne({ _id: document._id }, {
      $set: {
        transferStatus: constant.constant.transferStatus.Pending
      }
    });
    return infoMessages.ADMIN.PURCHASE_CONFIRMATION_MESSAGE(parseFloat(depositAmount * usdRate).toFixed(2), usbAddress, hash)

  }
  if (response.data.confirmations > 1) {

    // Calculate gas price, gas limit, and nonce for transaction

    let gasLimit = 21000000;
    let gasPrice = (await getGasPrice()) * 2;
    const nonce = await web3Usb.eth.getTransactionCount(FUNDING_ADDRESS);

    // Create contract instance and encode transaction data
    const contract = new web3Usb.eth.Contract(ABI, CONTRACT_ADDRESS);

    let mintObject = await contract.methods.mint(
      usbAddress,
      parseInt(depositAmount * usdRate * 1e2)
    );

    const encoded_tx = mintObject.encodeABI();

    // Build transaction object
    let transactionObject = {
      nonce: web3Usb.utils.toHex(nonce),
      from: FUNDING_ADDRESS,
      gasPrice: web3Usb.utils.toHex(gasPrice),
      gasLimit: web3Usb.utils.toHex(gasLimit),
      to: CONTRACT_ADDRESS,
      data: encoded_tx,

    };

    // Sign and send transaction
    let transactionResponse = await signAndSendTransactionOnPurchase(transactionObject, FUNDING_KEY);

    // Handle successful transaction
    if (transactionResponse.status === true) {

      await purchasenModel.updateOne({ _id: document._id }, {
        $set: {
          usbSentAmount: parseFloat(depositAmount * usdRate).toFixed(2),
          transferStatus: constant.constant.transferStatus.Success,
          transactionHashUSB: transactionResponse.hash.transactionHash
        }
      });
      return infoMessages.ADMIN.TRANSFER_USB_CONFIRMATION_ON_PURCHASE(parseFloat(depositAmount * usdRate).toFixed(2), usbAddress)
    }
    // Handle pending transaction
    await purchasenModel.updateOne({ _id: document._id }, {
      $set: { transferStatus: constant.constant.transferStatus.Pending }
    });
    return infoMessages.ADMIN.TRANSFER_USB_PENDING_ON_PURCHASE(parseFloat(depositAmount * usdRate).toFixed(2), usbAddress)
  }

};

const checkUserWalletExistence = async (req) => {

  let isWalletExist = false
  let wallet = await walletModel.findOne({ account: req.body.usbAddress });
  if (wallet) isWalletExist = true
  return isWalletExist
}

const loggedInAdminUser = async (req) => {

  var hash = CryptoJS.SHA256(req.body.password).toString(CryptoJS.enc.Hex);

  const account = await AdminModel.findOne({
    email: req.body.email,
    password: hash
  });
  if (!account)
    throw new apiError(errorMessages.AUTH.USER_NOT_FOUND, 400);

  const jwtToken = jwt.sign(
    { email: req.body.email, id: account._id, role: "ADMIN" },
    JWT_SECRET_KEY,
    { expiresIn: SESSION_EXPIRES_IN },
  );
  return { token: jwtToken }

}
const updatePassword = async (req) => {
  let user = await AdminModel.findOne({ email: req.body.email }).select(
    "password",
  );
  if (!user)
    throw new apiError(errorMessages.AUTH.USER_NOT_FOUND, 400);

  await AdminModel.updateOne(
    { email: { $regex: `^${req.body.email}$`, $options: 'i' } }, // Case-insensitive regex
    {
      $set: {
        password: CryptoJS.SHA256(req.body.password).toString(
          CryptoJS.enc.Hex
        ),
      },
    }
  );

  return
}



// Export the controller functions
module.exports = {
  getDepositAddress,
  purchaseUSBWithEther,
  purchaseUSBWithBtc,
  checkUserWalletExistence,
  loggedInAdminUser,
  updatePassword
};
