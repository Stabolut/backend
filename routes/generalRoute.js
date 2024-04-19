const router = require("express").Router();
const httpErrorHandler = require("../error/httpErrorHandler");
const { sendContactUserEmail, subscribe } = require("../controller/general");

const {
  contactUsValidation,
  subscribeValidation,
} = require("../validation/validation");
const { validateRequest } = require("../middlewares/validateRequest");
const route = require("./route");

router.post(
  route.CONTACT_US_EMAL,
  contactUsValidation(),
  validateRequest,
  httpErrorHandler(sendContactUserEmail)
);
router.post(
  route.SUBSCRIBE,
  subscribeValidation(),
  validateRequest,
  httpErrorHandler(subscribe)
);

module.exports = router;
