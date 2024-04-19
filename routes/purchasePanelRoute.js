const router = require("express").Router();
const httpErrorHandler = require("../error/httpErrorHandler");
const {
  getDepositAddress,
  purchaseUSBWithEther,
  purchaseUSBWithBtc,
  checkUserWalletExistence
} = require("../controller/purcahsePanel");

const {
  getDepositAddressValidation,
  purchaseUSBValidation,
  checkWalletAddressValidation
} = require("../validation/adminRouteValidation");

const { validateRequest } = require("../middlewares/validateRequest");
const route = require("./route");

router.get(
  route.GET_ADMIN_DEPOSIT_ADDRESS,
  getDepositAddressValidation(),
  validateRequest,
  httpErrorHandler(getDepositAddress)
);

router.post(
  route.PURCHASE_USB_WITH_ETH,
  purchaseUSBValidation(),
  validateRequest,
  httpErrorHandler(purchaseUSBWithEther)
);

router.post(
  route.PURCHASE_USB_WITH_BTC,
  purchaseUSBValidation(),
  validateRequest,
  httpErrorHandler(purchaseUSBWithBtc)
);

router.post(
  route.CHECK_USER_WALLET_EXISTANCE,
  checkWalletAddressValidation(),
  validateRequest,
  httpErrorHandler(checkUserWalletExistence)

);


module.exports = router;
