const router = require("express").Router();
const httpErrorHandler = require("../error/httpErrorHandler");
const {
  getUserByWalletOrUsername,
  assignUsernameToWallet,
  addContactList,
  getContactList,
} = require("../controller/user");

const {
  retrieveUserByWalletOrUsernameValidation,
  assingUsernameToWalletValidation,
  addContactListValidation,
  getContactListValidation,
} = require("../validation/userRouteValidation");
const { validateRequest } = require("../middlewares/validate-request");
const route = require("./route");

router.post(
  route.RETRIEVE_USER_BY_WALLET_ADDRESS_OR_USERNAME,
  retrieveUserByWalletOrUsernameValidation(),
  validateRequest,
  httpErrorHandler(getUserByWalletOrUsername)
);
router.post(
  route.ASSIGN_USERNAME_TO_WALLET,
  assingUsernameToWalletValidation(),
  validateRequest,
  httpErrorHandler(assignUsernameToWallet)
);

router.post(
  route.ADD_CONTACT_LIST,
  addContactListValidation(),
  validateRequest,
  httpErrorHandler(addContactList)
);

router.post(
  route.GET_CONTACT_LIST,
  getContactListValidation(),
  validateRequest,
  httpErrorHandler(getContactList)
);

module.exports = router;
