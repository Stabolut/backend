const { body } = require("express-validator");
const { errorMessages } = require("../constants/errors");
const validator = require('validator');

const addWalletValidation = () => [
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

  // body("token")
  //   .exists()
  //   .withMessage(errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("token"))
  //   .bail()
  //   .not()
  //   .isEmpty()
  //   .withMessage(errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("token"))
  //   .bail()
  //   .isString()
  //   .withMessage(
  //     errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("token")
  //   ),
]

const transferTokenValidation = () => [
  body("signature")
    .exists()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("signature"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("signature"))
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("signature")
    ),

  body("toAddress")
    .exists()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("toAddress"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("toAddress"))
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("toAddress")
    ),

  body("amount")
    .exists()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("amount"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("amount"))
    .bail(),

  body("nonce")
    .exists()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("nonce"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("nonce"))
    .bail(),

  body("originalAmount")
    .exists()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("originalAmount")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("originalAmount")
    )
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
        "originalAmount"
      )
    ),

  body("senderAddress")
    .exists()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("senderAddress")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("senderAddress")
    )
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
        "senderAddress"
      )
    ),

  body("transNotes")
    .exists()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("transNotes")
    )
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("transNotes")
    )
    .optional(),
];

walletAddressValidation = () => [
  body("walletAddress")
    .exists()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("walletAddress")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("walletAddress")
    )
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
        "walletAddress"
      )
    ),
];

transactionStatusUpdateStatus = () => [

  body("walletAddress")
    .exists()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("walletAddress")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("walletAddress")
    )
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
        "walletAddress"
      )
    ),

  body("transactionHash")
    .exists()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("transactionHash")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("transactionHash")
    )
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
        "transactionHash"
      )
    ),
  body("status")
    .exists()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("status")
    ),
];


coinMintValidation = () => [
  body("walletAddress")
    .exists()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("walletAddress")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("walletAddress")
    )
    .bail()
    .isString()
    .withMessage(
      errorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING(
        "walletAddress"
      )
    ),
  body("amount")
    .exists().withMessage(errorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("amount"))
    .bail()
    .notEmpty().withMessage(errorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("amount"))


];

module.exports = {
  addWalletValidation,
  transferTokenValidation,
  walletAddressValidation,
  transactionStatusUpdateStatus,
  coinMintValidation
};
