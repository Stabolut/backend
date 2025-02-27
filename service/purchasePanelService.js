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
  NETWORKS,
  TOKEN_DECIMAL,
} = require("../config");

const _ = require("lodash");
const axios = require("axios");
const {
  isValidEthereumAddress,
  signAndSendTransaction,
  signAndSendTransactionOnPurchase,
  getGasPrice,
  getNonce,
  getTokenBalance,
  transferPreSignedHex,
  isValidBTCAddress,
} = require("../utils/wallet");
const Web3 = require("web3");
const constant = require("../constants/constant");
const { infoMessages } = require("../constants/messages");
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken");
const { getWebInstance } = require("../utils/utils");
const conversionRateModel = require("../models/conversionRateModel");
const withdrawModel = require("../models/withdrawModel");
const { sendBTC } = require("../utils/sendBtc");


const web3Eth = new Web3(ETH_RPC_URL);
const web3Usb = new Web3(RPC_URI);
console.log("RPC_URI", RPC_URI)

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

  let networkInfo = NETWORKS[req.body.network]
  let web3Instance = getWebInstance(req.body.network)
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

  let findConversion = await conversionRateModel.findOne()
  usdRate = findConversion.ETH_TO_USD

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
  // // Step 1: Create a Subaccount
  // const subaccountId = await createSubaccountOnBitMEX(req.body.usbAddress); // Implement this function
  // const subaccount = new subaccountModel({
  //   userWalletAddress: req.body.usbAddress,
  //   subaccountId: subaccountId,
  //   cryptoBalance: despositAmount / 1e18, // ETH balance
  //   usbBalance: (despositAmount / 1e18) * usdRate, // USB balance
  //   cryptoType: constant.constant.currencyType.eth,
  // });
  // await subaccount.save();

  // // Step 2: Transfer ETH from Admin Address to Subaccount
  // await transferEthToSubaccount(admin.depositAddress, subaccountId, despositAmount / 1e18); // Implement this function

  // Step 3: Link Subaccount to Purchase Transaction
  // await purchasenModel.updateOne(
  //   { _id: document._id },
  //   {
  //     $set: { subaccountId: subaccount._id }, // Link subaccount to the transaction
  //   }
  // );

// Calculate gas price, gas limit, and nonce for transaction

  const gasPrice = (await getGasPrice(web3Instance)) * 2;
  const nonce = await getNonce(networkInfo.fundingAddress, web3Instance);
  // Create contract instance and encode transaction data
  const contract = new web3Instance.eth.Contract(ABI, networkInfo.contractAddress);

  let mintObject = await contract.methods.mint(
    req.body.usbAddress,
    parseInt((despositAmount / 1e18) * usdRate * 1e2)
  );
  const encodedTx = mintObject.encodeABI();

  // Construct transaction object
  let estimateTransactionObject = {
    nonce: web3Instance.utils.toHex(nonce),
    from: networkInfo.fundingAddress,
    gasPrice: web3Instance.utils.toHex(gasPrice),
    to: networkInfo.contractAddress,
    data: encodedTx,
  };

  const gasLimit = await web3Instance.eth.estimateGas(estimateTransactionObject);

  // Build transaction object
  let transactionObject = {
    nonce: web3Instance.utils.toHex(nonce),
    from: networkInfo.fundingAddress,
    gasPrice: web3Instance.utils.toHex(gasPrice),
    gasLimit: web3Instance.utils.toHex(gasLimit),
    to: networkInfo.contractAddress,
    data: encodedTx,

  };

  // Sign and send transaction
  let transactionResponse = await signAndSendTransactionOnPurchase(transactionObject, networkInfo.fundingKey, web3Instance);
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




  let depositAmount, usdRate, document, response
  const { usbAddress, amount, hash } = req.body
  let networkInfo = NETWORKS[req.body.network]
  let web3Instance = getWebInstance(req.body.network)


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
  let findConversion = await conversionRateModel.findOne()
  usdRate = findConversion.BTC_TO_USD

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
  console.log("document save", hash)


  try {
    response = await axios.get(`${BITPAY_URL}/tx/${hash}`);
  }
  catch (e) {

    console.log("catch", e, `${BITPAY_URL}/tx/${hash}`)
    await purchasenModel.updateOne({ _id: document._id }, {
      $set: {
        transferStatus: constant.constant.transferStatus.Pending
      }
    });
    return infoMessages.ADMIN.PURCHASE_CONFIRMATION_MESSAGE(parseFloat(depositAmount * usdRate).toFixed(2), usbAddress, hash)

  }
  if (response.data.status.confirmed === true) {

    // Calculate gas price, gas limit, and nonce for transaction

    const gasPrice = (await getGasPrice(web3Instance)) * 2;
    const nonce = await getNonce(networkInfo.fundingAddress, web3Instance);
    // Create contract instance and encode transaction data
    const contract = new web3Instance.eth.Contract(ABI, networkInfo.contractAddress);

    let mintObject = await contract.methods.mint(
      req.body.usbAddress,
      parseInt((depositAmount) * usdRate * 1e2)
    );
    const encodedTx = mintObject.encodeABI();


    // Construct transaction object
    let estimateTransactionObject = {
      nonce: web3Instance.utils.toHex(nonce),
      from: networkInfo.fundingAddress,
      gasPrice: web3Instance.utils.toHex(gasPrice),
      to: networkInfo.contractAddress,
      data: encodedTx,
    };

    const gasLimit = await web3Instance.eth.estimateGas(estimateTransactionObject);

    // Build transaction object
    let transactionObject = {
      nonce: web3Instance.utils.toHex(nonce),
      from: networkInfo.fundingAddress,
      gasPrice: web3Instance.utils.toHex(gasPrice),
      gasLimit: web3Instance.utils.toHex(gasLimit),
      to: networkInfo.contractAddress,
      data: encodedTx,

    };

    // Sign and send transaction
    let transactionResponse = await signAndSendTransactionOnPurchase(transactionObject, networkInfo.fundingKey, web3Instance);

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


const ethWithdrawal = async (req) => {

  // First check user balance
  let networkInfo = NETWORKS[req.body.network]
  let web3Instance = getWebInstance(req.body.network)
  let { signature, amount } = req.body

  // First check user balance
  // Validate recipient address
  if (!isValidEthereumAddress(req.body.userAddress))
    throw new apiError(
      errorMessages.ADMIN.INVALID_WALLET_ADDRESS(req.body.userAddress),
      400
    );

  let balance = await getTokenBalance(req.body.userAddress, networkInfo.contractAddress, web3Instance)

  if (balance / TOKEN_DECIMAL < parseFloat(req.body.orignalAmont)) {
    throw new apiError(`You don't have enough USB coins to withdraw. You are trying to withdraw ${req.body.orignalAmont} USB, but your current balance is ${balance / TOKEN_DECIMAL} USB.`, 400);
  }

  let findConversion = await conversionRateModel.findOne()
  usdRate = findConversion.ETH_TO_USD
  let ethAmountSend = parseFloat(req.body.orignalAmont) / usdRate



  const balanceWei = await web3Eth.eth.getBalance(networkInfo.fundingAddress);

  if (parseFloat(balanceWei / 1e18) < parseFloat(ethAmountSend)) {
    throw new apiError("We are unable to process your request at the moment. Please try again later")
  }

  const gasPrice = (await getGasPrice(web3Instance)) * 2;
  const nonce = await getNonce(networkInfo.fundingAddress, web3Instance);


  const encoded_tx = await transferPreSignedHex(
    signature,
    networkInfo.fundingAddress,
    parseInt(amount),
    parseInt(req.body.nonce),
    networkInfo.contractAddress,
    web3Instance
  );
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
  // CALCULATE HOW MUCH ETH WILL BE TRANSFER TO USER
  const ethGasPrice = await web3Eth.eth.getGasPrice(); // Get current gas price
  const ethNonce = await web3Eth.eth.getTransactionCount(networkInfo.fundingAddress, "latest"); // Get nonce
  const tx = {
    from: networkInfo.fundingAddress,
    to: req.body.userAddress,
    value: web3Eth.utils.toWei(ethAmountSend.toString(), "ether"), // Convert ETH to Wei
    gas: 21000, // Standard gas limit for ETH transfer
    gasPrice: ethGasPrice,
    nonce: ethNonce,
    chainId: process.env.ETH_CHAIN_ID, // Mainnet (change for testnet)
  };
  // const balanceWei = await web3Eth.eth.getBalance(networkInfo.fundingAddress);
  // console.log("ethAmountSend tx", tx, balanceWei)
  const signedTx = await web3Eth.eth.accounts.signTransaction(tx, networkInfo.fundingKey);
  const txReceipt = await web3Eth.eth.sendSignedTransaction(signedTx.rawTransaction);
  let withdraw = new withdrawModel({ usbAmountToWithdraw: req.body.orignalAmont, amountToSend: ethAmountSend, ethTransactionHash: txReceipt.transactionHash, usbTransactionHash: hash.transactionHash, walletAddress: req.body.userAddress })
  await withdraw.save()
  return infoMessages.ADMIN.USB_ETH_WITHDRAWAL_MESSAGE(ethAmountSend.toFixed(4), req.body.orignalAmont)

}

const btcWithdrawal = async (req) => {

  // First check user balance
  let networkInfo = NETWORKS[req.body.network]
  let web3Instance = getWebInstance(req.body.network)
  let { signature, amount } = req.body
  if (!isValidEthereumAddress(req.body.userAddress))
    throw new apiError(
      errorMessages.ADMIN.INVALID_WALLET_ADDRESS("Wallet"),
      400
    );
  if (!isValidBTCAddress(req.body.btcWalletAddress, "testnet"))
    throw new apiError(
      errorMessages.ADMIN.INVALID_WALLET_ADDRESS(req.body.btcWalletAddress),
      400
    );

  let balance = await getTokenBalance(req.body.userAddress, networkInfo.contractAddress, web3Instance)
  if (balance / TOKEN_DECIMAL < req.body.withdrawAmount) {
    throw new apiError("Insufficient balance", 400);
  }

  const gasPrice = (await getGasPrice(web3Instance)) * 2;
  const nonce = await getNonce(networkInfo.fundingAddress, web3Instance);
  console.log("gasPrice", gasPrice, nonce, (networkInfo.fundingAddress))

  const encoded_tx = await transferPreSignedHex(
    signature,
    networkInfo.fundingAddress,
    parseInt(amount),
    parseInt(req.body.nonce),
    networkInfo.contractAddress,
    web3Instance
  );
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
  console.log("hash", hash)

  // CALCULATE HOW MUCH BTC WILL BE TRANSFER TO USER
  let findConversion = await conversionRateModel.findOne()
  usdRate = findConversion.BTC_TO_USD
  let amountSendInBtc = parseFloat(req.body.orignalAmont) / usdRate;
  let amountInSatoshi = Math.round(amountSendInBtc * 1e8);
  console.log("usbAmountReceived", req.body.orignalAmont, "amountSendInBtc", amountSendInBtc, "amountInSatoshi", amountInSatoshi)
  //tb1qzupjjggtwqkg2yyxuvqgs6xf9d5jl57scxyr8n
  const txid = await sendBTC(req.body.btcWalletAddress, amountInSatoshi);
  let withdraw = new withdrawModel({ usbAmountToWithdraw: req.body.orignalAmont, amountToSend: amountSendInBtc, btcTransactionHash: txid, usbTransactionHash: hash.transactionHash, walletAddress: req.body.btcWalletAddress })
  await withdraw.save()
  return infoMessages.ADMIN.USB_BTC_WITHDRAWAL_MESSAGE(amountSendInBtc.toFixed(8), req.body.orignalAmont)

}


// Export the controller functions
module.exports = {
  getDepositAddress,
  purchaseUSBWithEther,
  purchaseUSBWithBtc,
  checkUserWalletExistence,
  loggedInAdminUser,
  updatePassword,
  ethWithdrawal,
  btcWithdrawal
};
