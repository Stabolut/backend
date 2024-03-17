const { body } = require("express-validator");
const { ErrorMessages } = require("../constants/errors");

const subscribeValidation = () => [
  body("email")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("email"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("email"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("email")
    )
    .bail()
    .custom((value) => validateEmail(value))
    .withMessage(ErrorMessages.AUTH.VALIDATION_FAILED("Email")),

  body("name")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("name"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("name"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("name")
    ),

  body("cname")
    .exists()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("Company name")
    )
    .bail()
    .not()
    .isEmpty()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("Company name")
    )
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("Company name")
    ),
];

const contactUsValidation = () => [
  body("email")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("email"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("email"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("email")
    )
    .bail()
    .custom((value) => validateEmail(value))
    .withMessage(ErrorMessages.AUTH.VALIDATION_FAILED("Email")),

  body("name")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("name"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("name"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("name")
    ),

  body("message")
    .exists()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("message"))
    .bail()
    .not()
    .isEmpty()
    .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("message"))
    .bail()
    .isString()
    .withMessage(
      ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("message")
    ),
];
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
module.exports = {
  subscribeValidation,
  contactUsValidation,
};
