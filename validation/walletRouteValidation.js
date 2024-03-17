const { body } = require("express-validator");
const { ErrorMessages } = require("../constants/errors");

const addWalletValidation = () => [
  body("account")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("account"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("account"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("account")
    ),

  body("token")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("token"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("token"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("token")
    ),
];

const transferTokenValidation = () => [
  body("signature")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("signature"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("signature"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("signature")
    ),

  body("toAddress")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("toAddress"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("toAddress"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("toAddress")
    ),

  body("amount")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("amount"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("amount"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("amount")
    ),

  body("nonce")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("nonce"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("nonce"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("nonce")
    ),

  body("originalAmount")
    .exists()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("originalAmount")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("originalAmount")
    )
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
        "originalAmount"
      )
    ),

  body("senderAddress")
    .exists()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("senderAddress")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("senderAddress")
    )
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
        "senderAddress"
      )
    ),

  body("transNotes")
    .exists()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("transNotes")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("transNotes")
    )
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("transNotes")
    )
    .optional(),
];

walletAddressValidation = () => [
  body("walletAddress")
    .exists()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("walletAddress")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("walletAddress")
    )
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
        "walletAddress"
      )
    ),
];

transactionStatusUpdateStatus = () => [
 
    body("walletAddress")
    .exists()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("walletAddress")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("walletAddress")
    )
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
        "walletAddress"
      )
    ),

  body("transactionHash")
    .exists()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("transactionHash")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("transactionHash")
    )
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
        "transactionHash"
      )
    ),
  body("status")
    .exists()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("status")
    ),
];

module.exports = {
  addWalletValidation,
  transferTokenValidation,
  walletAddressValidation,
  transactionStatusUpdateStatus
};
