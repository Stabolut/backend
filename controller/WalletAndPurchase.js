const {
  errorResponse,
  routeResponseOnlyMessage,
  routeResponseWithData,
} = require("../utils/responses");
const { ErrorMessages } = require("../constants/errors");
const {
  isValidEthereumAddress,
  signAndSendTransaction,
} = require("../utils/wallet");
const {
  createAndEncryptWallet,
  decryptWallet,
} = require("../utils/helperMethod");
const DepositAdminModel = require("../models/DepositAdminAddressesModel");
const axios = require("axios");
const PurchasenModel = require("../models/PurchaseModel");
const _ = require("lodash");
const {
  ADMIN_BTC_ADDRESS,
  ETH_TO_USD_URL,
  BTC_TO_USD_URL,
  ABI,
  CONTRACT_ADDRESS,
  RPC_URI,
  FUNDING_ADDRESS,
  FUNDING_KEY,
  BITPAY_URL,
  BLOCKCHAIN_CHAIN_ID,
} = require("../config");
// Import web3.js library
const Web3 = require("web3");
//TODO: Create a web3 instance it should be in seperate file and import here will do that later
const web3Eth = new Web3(
  "https://goerli.infura.io/v3/14c7306f3074467fad55bcc4a99fbd06"
);
const web3Usb = new Web3(
  "https://silent-hardworking-fog.arbitrum-goerli.discover.quiknode.pro/644204ee97ff9e5f0a6fc1e136c3fca78ed13159/"
);

// Define th

createBtcWallet = async (req, res) => {
  try {
    console.log("I am in user wallet exist but btc wallet not exist");
    let wallet = await createAndEncryptWallet();
    let decrypt = await decryptWallet(wallet);
    return routeResponseWithData(res, true, "Btc wallet created", decrypt, 200);
  } catch (e) {
    console.log("heree", e);
    return errorResponse(
      res,
      ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("createBtcWallet", e.message),
      500
    );
  }
};

getBtcBalance = async (req, res) => {
  try {
    let response = await axios.get(
      `${BITPAY_URL}/address/${req.body.address}/balance`
    );
    let accounBlanace = response.data.balance / 100000000;
    let btcToSantoshi = accounBlanace * 100000000;
    return routeResponseWithData(
      res,
      true,
      "btc wallet get successfully",
      { accounBlanace, btcToSantoshi },
      200
    );
  } catch (e) {
    return errorResponse(
      res,
      ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("getBtcBalance", e.message),
      500
    );
  }
};
purchaseUSB = async (req, res) => {
  try {
    let despositAmount, usdRate;

    let admin = await DepositAdminModel.findOne({
      type: "btc",
      isActive: true,
    });
    if (!isValidEthereumAddress(req.body.usbAddress))
      return errorResponse(res, "recipient address is invalid", 400);
    let checkHashExist = await PurchasenModel.findOne({
      transactionHash: req.body.hash,
    });
    if (checkHashExist)
      return errorResponse(
        res,
        `It appears that the hash you entered has already been utilized. We have completed the transfer of ${checkHashExist.usbSend} USB to the account ${checkHashExist.purchaseUSBWallet} using that hash. To continue, please provide an alternative hash.`,
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
        return errorResponse(
          res,
          ErrorMessages.GENERIC_ERROR.INVALID_HASH(admin.depositAddress),
          400
        );
      }
      if (userFind) {
        //  if ((receiedTransactionObject.value / 100000000) < 0.5) return errorResponse(res, "To purchase a USB coin, a minimum deposit of 0.5 BTC is required.", 400)

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
          // chainId: web3.utils.toHex(BLOCKCHAIN_CHAIN_ID),
        };
        console.log("xxxxxx", transactionObject);

        const hash = await signAndSendTransaction(
          transactionObject,
          FUNDING_KEY
        );
        console.log("hash", hash);

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

      return routeResponseOnlyMessage(
        res,
        true,
        `Your purchase of ${(despositAmount * usdRate).toFixed(
          2
        )} USB coins has been completed successfully. The USB coins have been sent to the wallet address you provided: ${
          req.body.usbAddress
        }.`
      );
    } else {
      return errorResponse(
        res,
        "To purchase a USB using Bitcoin, you need to ensure that your Bitcoin transaction receives at least one confirmation. This means that the transaction needs to be verified by the Bitcoin network and added to the blockchain before it can be considered valid.",
        400
      );
    }
  } catch (e) {
    console.log("Fff", e);

    let msg = e?.response?.data
      ? e.response.data
      : e?.message
      ? e.message
      : ErrorMessages.GENERIC_ERROR.INVALID_HASH(ADMIN_BTC_ADDRESS);

    return errorResponse(res, msg, 500);
  }
};

purchaseUSBEth = async (req, res) => {
  try {
    let despositAmount;

    if (!isValidEthereumAddress(req.body.usbAddress))
      return errorResponse(res, "recipient address is invalid", 400);
    let resp = await web3Eth.eth.getTransactionReceipt(req.body.hash);
    let tx = await web3Eth.eth.getTransaction(req.body.hash);
    console.log("resp", resp);

    if (!resp) {
      errorResponse(
        res,
        `Your transaction in not confrmed when it's cinfimred then please deposit hash`,
        400
      );
      return;
    }

    if (resp && resp.status === false) {
      errorResponse(
        res,
        `Your transaction in not confrmed when it's cinfimred then please deposit hash`,
        400
      );
      return;
    }
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
      return errorResponse(
        res,
        `It appears that the hash you entered has already been utilized. We have completed the transfer of ${checkHashExist.usbSend} USB to the account ${checkHashExist.purchaseUSBWallet} using that hash. To continue, please provide an alternative hash.`,
        400
      );

    if (resp.to !== admin.depositAddress.toLowerCase())
      return errorResponse(
        res,
        ErrorMessages.GENERIC_ERROR.INVALID_HASH(admin.depositAddress),
        400
      );

    const response = await axios.get(ETH_TO_USD_URL);

    let usdRate = response.data.ethereum.usd;
    //1959.13
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
      // chainId: web3.utils.toHex(BLOCKCHAIN_CHAIN_ID),
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

    //1079

    return routeResponseOnlyMessage(
      res,
      true,
      `Your purchase of ${((despositAmount / 1e18) * usdRate).toFixed(
        2
      )} USB coins has been completed successfully. The USB coins have been sent to the wallet address you provided: ${
        req.body.usbAddress
      }.`
    );
  } catch (e) {
    console.log("e", e);

    let msg = e?.response?.data
      ? e.response.data
      : e?.message
      ? e.message
      : ErrorMessages.GENERIC_ERROR.INVALID_HASH(ADMIN_BTC_ADDRESS);

    return errorResponse(res, msg, 500);
  }
};

getDepositAddress = async (req, res) => {
  try {
    let depositAddress = await DepositAdminModel.findOne({
      isActive: true,
      type: req.query.type,
    });
    return routeResponseWithData(
      res,
      true,
      "Admin deposit address get successfully",
      depositAddress,
      200
    );
  } catch (e) {
    console.log("heree", e);
    return errorResponse(
      res,
      ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
        "get admin address",
        e.message
      ),
      500
    );
  }
};

module.exports = {
  createBtcWallet,
  getBtcBalance,
  purchaseUSB,
  getDepositAddress,
  purchaseUSBEth,
};
