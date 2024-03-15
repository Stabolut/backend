const { body, param, query, check } = require("express-validator");
const { ErrorMessages } = require("../constants/errors")
const { infoMessages } = require("../constants/messages")
const { constant } = require("../constants/constant")


const registerUserValidation = () => [


    body("username")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("username"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("username")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("username"))
        .bail().custom((value) => validateUsername(value))
        .withMessage(ErrorMessages.AUTH.INVALID_USERNAME("username")),

    body("name")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("name"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("name"))
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("name"))
        .bail()
        .isLength({ min: constant.fname.minLength, max: constant.fname.maxLength })
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.MIN_MAX_LENGTH_ERROR("name", constant.fname.minLength - 1, constant.fname.maxLength)),


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

    body("password")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("password"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("password"))
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("password"))
        .bail().custom((value) => validatePassword(value))
        .withMessage(ErrorMessages.AUTH.INVALID_PASSWORD("Password"))



];

 const loginUserValidation = () => [


    body("username")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("username"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(
            ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("username")
        )
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("username")),


    body("password")
        .exists()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("password"))
        .bail()
        .not()
        .isEmpty()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("password"))
        .bail()
        .isString()
        .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("password"))

];



// export const otpVerificationValidation = () => [


//     body("otpCode")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("otpCode"))
//         .bail()
//         .isLength({ min: constant.otpTokenLength.minLength, max: constant.otpTokenLength.maxLength })
//         .withMessage(ErrorMessages.AUTH.INVALID_OTP_TOKEN(constant.otpTokenLength.minLength, constant.otpTokenLength.maxLength)),

//     body("authValue")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("authvValue"))
//         .bail()
//         .not()
//         .isEmpty()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("Auth value"))
//         .bail()
//         .isString()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("Auth value"))
// ];

// export const resendOtpValidation = () => [


//     body("email")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("mobileNumber"))
//         .bail()
//         .not()
//         .isEmpty()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("Mobile number")),

//     body("mobileNumber")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("mobileNumber"))
//         .bail()
//         .not()
//         .isEmpty()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("Mobile number")),

// ];

// export const forgetPasswordValidation = () => [

//     body("forgotType")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("forgotType"))
//         .bail()
//         .not()
//         .isEmpty()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("Forgot type")).bail().custom((value) => validateForgotType(value))
//         .withMessage("Invalid forgotType only allowed Username | Password"),

//     body("authenticateMediumType")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("authenticateMediumType"))
//         .bail()
//         .not()
//         .isEmpty()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("Authenticate medium type")).bail().custom((value) => validateOtpMedium(value))
//         .withMessage("Invalid authenticateMediumType only allowed Email|Phone"),

//     body("email")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("email"))
//         .bail()
//         .not()
//         .isEmpty()
//         .withMessage(
//             ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("email")
//         )
//         .bail()
//         .isString()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("email"))
//         .bail().custom((value) => validateEmail(value))
//         .withMessage(ErrorMessages.AUTH.VALIDATION_FAILED("email")).optional(),

// ];

// export const updatePasswordValidation = () => [

//     body("password")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("password"))
//         .bail()
//         .not()
//         .isEmpty()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("password"))
//         .bail()
//         .isString()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("password"))
//         .bail().custom((value) => validatePassword(value))
//         .withMessage(ErrorMessages.AUTH.INVALID_PASSWORD("Password")),


//     //isLength({ min: constant.password.minLength })
//     //  .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.UNSECURE_PASSWORD(constant.password.minLength)),

//     body("confirmPassword")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("password"))
//         .bail()
//         .not()
//         .isEmpty()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("password"))
//         .bail()
//         .isString()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("password")),


//     body("otpCode")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("otpCode"))
//         .bail()
//         .isLength({ min: constant.otpTokenLength.minLength, max: constant.otpTokenLength.maxLength })
//         .withMessage(ErrorMessages.AUTH.INVALID_OTP_TOKEN(constant.otpTokenLength.minLength, constant.otpTokenLength.maxLength)),

// ]


// export const updatePasswordValidationOnProfile = () => [

//     body("password")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("password"))
//         .bail()
//         .not()
//         .isEmpty()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("password"))
//         .bail()
//         .isString()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("password"))
//         .bail().custom((value) => validatePassword(value))
//         .withMessage(ErrorMessages.AUTH.INVALID_PASSWORD("Password")),

//     //isLength({ min: constant.password.minLength })
//     //.withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.UNSECURE_PASSWORD(constant.password.minLength)),

//     body("confirmPassword")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("confirmPassword"))
//         .bail()
//         .not()
//         .isEmpty()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("confirmPassword"))
//         .bail()
//         .isString()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("confirmPassword")),


//     body("oldPassword")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("oldPassword"))
//         .bail()
//         .not()
//         .isEmpty()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("oldPassword"))
//         .bail()
//         .isString()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.VALUE_MUST_BE_STRING("oldPassword")),

// ]


// export const resendOtpValidationOnEmail = () => [


//     body("email")
//         .exists()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.KEY_MISSING("mobileNumber"))
//         .bail()
//         .not()
//         .isEmpty()
//         .withMessage(ErrorMessages.COMMON_VALIDATION_ERROR.EMPTY_VALUE("Mobile number")),
// ];




function validateUsername(username) {
    //const re = /^(?!.*[_\s-]{2,})[a-zA-Z0-9][a-zA-Z0-9_\-]*[a-zA-Z0-9]$/
    const re = /^[a-zA-Z]([.@_-]?[a-zA-Z0-9]+)*$/
    return re.test(String(username))
}

function validatePassword(password) {
    //const re = /^(?!.*[_\s-]{2,})[a-zA-Z0-9][a-zA-Z0-9_\-]*[a-zA-Z0-9]$/
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{9,}$/;
    return re.test(String(password))
}


function validateEmail(email) {
    const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

const validateGender = (gender) => {
    return genderType.find((x) => x === gender) ? true : false;
};

const validateOtpMedium = (otpMedium) => {
    return otpMediumType.find((x) => x === otpMedium) ? true : false;
};

const validateForgotType = (forgotType) => {
    return userForgotType.find((x) => x === forgotType) ? true : false;
};


module.exports =
{
    registerUserValidation,
    loginUserValidation
}
