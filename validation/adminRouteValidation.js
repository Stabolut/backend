const { body, query } = require("express-validator");
const { errorMessages } = require("../constants/errors");
const constant = require("../constants/constant");


let addressType = [constant.constant.currencyType.btc, constant.constant.currencyType.eth];

const getDepositAddressValidation = () => [
  query("type")
    .exists()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("type"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("type"))
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("type")
    )
    .custom((value) => validateAddressType(value))
    .withMessage(errorMessages.ADMIN.INVALID_ADDRESS_TYPE),
];

const purchaseUSBValidation = () => [
  body("usbAddress")
    .exists()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("usbAddress")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("usbAddress")
    )
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("usbAddress")
    ),

  body("hash")
    .exists()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("hash"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("hash"))
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("hash")
    ),

  body("amount")
    .exists()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("amount"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("amount"))
    .bail()
    .isNumeric()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_NUMERIC("amount")
    ),
];

const checkWalletAddressValidation = () => [

  body("usbAddress")
      .exists()
      .withMessage(errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("usbAddress"))
      .bail()
      .not()
      .isEmpty()
      .withMessage(
        errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("usbAddress")
      )
      .bail()
      .isString()
      .withMessage(errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("usbAddress")),


];

const validateAddressType = (type) => {
  return addressType.find((x) => x === type) ? true : false;
};

module.exports = {
  getDepositAddressValidation,
  purchaseUSBValidation,
  checkWalletAddressValidation
};
