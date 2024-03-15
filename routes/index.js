const express = require("express");

const transferTokens = require("../controller/trasnfer-tokens");
const {
  limitTransaction,
  allTransaction,
} = require("../controller/transaction-list");
const updateTransactionStatus = require("../controller/update-transaction-status");
const addWallet = require("../controller/add-wallet");
const { contactUsEmail, subscribedEmail } = require("../controller/email");
const {
  addUsername,
  getUserByAccount,
  addContactListInfo,
  getContactListInfo,
} = require("../controller/userInfo");
const {
  createBtcWallet,
  getBtcBalance,
  purchaseUSB,
  getDepositAddress,
  purchaseUSBEth,
} = require("../controller/WalletAndPurchase");
const createWallet = require("../controller/create-wallet");
const { validateRequest } = require("../middlewares/validate-request");
const { authentication } = require("../middlewares/authentication");
const {
  createBtcWalletValidation,
  purchaseUSBValidation,
  subscribeValidation,
  contactUsValidation,
  addWalletValidation,
  addContactListValidation,
  stakeValidation,
  walletValidation,
} = require("../validation/validation");
const {
  registerUserValidation,
  loginUserValidation,
} = require("../validation/authValidation");
const {
  addInStake,
  getStakeList,
  allStakeTransactionList,
  stakeReward,
} = require("../controller/stake");
// Auth Service Controller
const { registerUser, loggedInUser } = require("../controller/auth");
const router = express.Router();

// Auth Service
router.post(
  "/auth/register",
  registerUserValidation(),
  validateRequest,
  registerUser
);
router.post(
  "/auth/login",
  loginUserValidation(),
  validateRequest,
  loggedInUser
);

// Just for testing route
router.get("/create-btc-wallet", createBtcWallet);
router.post("/get-btc-balance", getBtcBalance);
router.post(
  "/purchase-usb",
  purchaseUSBValidation(),
  validateRequest,
  purchaseUSB
);
router.post(
  "/purchase-eth",
  purchaseUSBValidation(),
  validateRequest,
  purchaseUSBEth
);

router.get("/get-admin-deposit-address", getDepositAddress);

router.get("/wallet", createWallet);

// Balance swap and converison routes
router.post("/transfer", transferTokens);
router.post("/transaction", limitTransaction);
router.post("/all-transaction", allTransaction);
router.post("/update-transaction-status", updateTransactionStatus);
router.post("/add-wallet", addWalletValidation(), validateRequest, addWallet);
router.post(
  "/contact-us-email",
  contactUsValidation(),
  validateRequest,
  contactUsEmail
);
router.post(
  "/subscribe",
  subscribeValidation(),
  validateRequest,
  subscribedEmail
);

router.post("/add-username", addUsername);
router.post(
  "/add-contact",
  addContactListValidation(),
  validateRequest,
  addContactListInfo
);
router.post(
  "/get-contact",
  addWalletValidation(),
  validateRequest,
  getContactListInfo
);
router.post("/get-user-by-wallet", getUserByAccount);

// Stake microservice
router.post("/add-in-stake", stakeValidation(), validateRequest, addInStake);
router.post(
  "/get-in-stake",
  addWalletValidation(),
  validateRequest,
  getStakeList
);
router.post(
  "/stake-transaction",
  walletValidation(),
  validateRequest,
  allStakeTransactionList
);
router.post("/stake-reward", walletValidation(), validateRequest, stakeReward);

module.exports = router;
