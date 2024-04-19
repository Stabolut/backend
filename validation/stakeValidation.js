const { body } = require("express-validator");
const { errorMessages } = require("../constants/errors");

const addInStakeValidation = () => [
  body("wallet")
    .exists()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("wallet"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("wallet"))
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("wallet")
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

const getInStakeValidation = () => [
  body("account")
    .exists()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("account"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("account"))
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("account")
    ),
];

const stakeWalletValidations = () => [
  body("wallet")
    .exists()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("wallet"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("wallet"))
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("wallet")
    ),
];

module.exports = {
  addInStakeValidation,
  getInStakeValidation,
  stakeWalletValidations,
};
