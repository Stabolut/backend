const router = require("express").Router();
const httpErrorHandler = require("../error/httpErrorHandler");
const {
  getDepositAddress,
  purchaseUSBWithEther,
  purchaseUSBWithBtc
} = require("../controller/purcahsePanel");

const {
  getDepositAddressValidation,
  purchaseUSBValidation,
} = require("../validation/adminRouteValidation");

const { validateRequest } = require("../middlewares/validate-request");
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

module.exports = router;
