const { body, param, query, check } = require("express-validator");
const { ErrorMessages } = require("../constants/errors")
const { InfoMessages } = require("../constants/messages")
// const constant = require("../constants/constant")



const createBtcWalletValidation = () => [

    body("usdbAddress")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("usdbAddress"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("usdbAddress")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("usdbAddress")),
];



const subscribeValidation = () => [

    body("email")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("email"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("email")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("email"))
        .bail().custom((value) => validateEmail(value))
        .withMessage(ErrorMessages.AUTH.VALIDATION_FAILED("Email")),


    body("name")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("name"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("name")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("name")),

    body("cname")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("Company name"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("Company name")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("Company name")),
];


const contactUsValidation = () => [

    body("email")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("email"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("email")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("email"))
        .bail().custom((value) => validateEmail(value))
        .withMessage(ErrorMessages.AUTH.VALIDATION_FAILED("Email")),


    body("name")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("name"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("name")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("name")),

    body("message")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("message"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("message")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("message")),

];


const addWalletValidation = () => [

    body("account")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("account"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("account")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("account")),
];


const addContactListValidation = () => [

    body("receiverAccount")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("receiverAccount"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("receiverAccount")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("receiverAccount")),

    body("senderAccount")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("senderAccount"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("senderAccount")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("senderAccount")),

    body("name")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("name"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("name")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("name")),


];


const stakeValidation = () => [

    body("wallet")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("wallet"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("wallet")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("wallet")),

    body("amount")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("amount"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("amount"))
        .bail()
        .isNumeric()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_NUMERIC("amount")),
];

const walletValidation = () => [

    body("wallet")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("wallet"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("wallet")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("wallet")),

    
];





function validateEmail(email) {
    const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}



module.exports =
{
    createBtcWalletValidation,
    purchaseUSBValidation,
    subscribeValidation,
    contactUsValidation,
    addWalletValidation,
    addContactListValidation,
    stakeValidation,
    walletValidation
}

