const { body, param, query, check } = require("express-validator");
const { ErrorMessages } = require("../constants/errors");

let addressType = ["btc", "eth"];

const getDepositAddressValidation = () => [
  query("type")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("type"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("type"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("type")
    )
    .custom((value) => validateAddressType(value))
    .withMessage(ErrorMessages.ADMIN.INVALID_ADDRESS_TYPE),
];

const purchaseUSBValidation = () => [
  body("usbAddress")
    .exists()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("usbAddress")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("usbAddress")
    )
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("usbAddress")
    ),

  body("hash")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("hash"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("hash"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("hash")
    ),
];

const validateAddressType = (type) => {
  return addressType.find((x) => x === type) ? true : false;
};

module.exports = {
  getDepositAddressValidation,
  purchaseUSBValidation,
};
