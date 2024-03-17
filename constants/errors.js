const ErrorMessages = {
  COMMON_VALIDATION_ERROR: {
    MAX_LENGTH_ERROR: (key, character) =>
      `${key} must be lesser than ${character} characters`,
    MIN_LENGTH_ERROR: (key, character) =>
      `${key} must be greater than ${character - 1} characters`,
    INVALID_DATA_TYPE: (value, expectedType) =>
      `${value} value must be of type ${expectedType}`,
    KEY_MISSING: (key) => `${key} key is missing`,
    EMPTY_VALUE: (value) => `${value} cannot be empty`,
    VALUE_MUST_BE_STRING: (value) => `The ${value} must be string`,
    VALUE_MUST_BE_NUMBER: (value) => `The ${value} must be number`,
    VALUE_MUST_BE_NUMERIC: (value) => `The ${value} must be numeric`,
    STRING_MAX_LENGTH: (key, length) =>
      `${key} must be lesser than equal to ${length} characters.`,
    MIN_MAX_LENGTH_ERROR: (value, min, max) =>
      `${value} must be greater than ${min} character and less than ${
        max + 1
      } characters.`,
    INVALID_VALUE: (value) => `Invalid ${value} value `,
    PARAM_MISSING: (param) => `Required param: ${param} is missing.`,
    VALUE_MUST_BE_INT: "The provided value must be an integer",
    VALUE_MUST_BE_GREATER_THAN_ZERO:
      "The provided value must be greater than zero",
    ID_NOT_VALID_STRING_PARAM: (key) => `${key} Id not valid.`,
    ID_NOT_VALID_MONGO_KEY: (key) => `${key} Id not valid key.`,
    INVALID_EMAIL: "Email is not valid",
    ENUM_VALUES_REQUIRED: (enumValues) =>
      `The provided value must be one these values ${enumValues}`,
    STRING_MIN_MAX_LENGTH: (key, min, max) =>
      `${key} must be at least ${min} characters and maximum ${max} characters long.`,
    DATA_NOT_FOUND_JOB: (key, purpose) =>
      `No data found when running the Job against the following key ${key} to carry out ${purpose}`,
    BUCKET_UPLOAD_ERROR: "Problem in uploading file to bucket",
    BUCKET_DELETE_ERROR: "Problem in deleting file from bucket",
    BUCKET_READ_ERROR: "Problem in reading file from bucket",
    UNSECURE_PASSWORD: (value) =>
      `Please choose a more secure password. It should be longer than ${
        value - 1
      } characters, unique to you and difficult for others to guess.`,
    USER_NOT_FOUND: "We didn't find any user against these credential",
    REQUIRED_FIELD_ERROR: (value) => `Please provide a ${value} value.`,
  },
  AUTH: {
    VALIDATION_FAILED: (value) => `${value} is not valid`,
    INVALID_USERNAME: (value) =>
      `The ${value} is not valid. Username must start with a letter and end with a letter or number and only letter, number, and special character @_-. are allowed`,
    INVALID_PASSWORD: (value) =>
      `Please choose a more secure password. ${value} must be greater than 8 characters long and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character`,
    EMAIL_FAILED: (value) => `${value} is not valid`,
    EMAIL_ALREADY_EXIST: (email) =>
      `The email: ${email} has already been taken. Please try different email`,
    PHONE_ALREADY_EXIST: (phone) =>
      `The phone: ${phone} has already been taken. Please try different phone number`,
    PASSWORD_NOT_MATCH: `The password and confirm password do not match.Please try again.`,
    USERNAME_ALREADY_EXIST: (username) =>
      `The username: ${username} has already been taken. Please try different username`,
    REFERRAL_CODE_NOT_EXIST: `This referral code doesn't exist`,
    USER_REGISTER_FAIL: `Sorry we are facing some problem to authenticate your mobile and email.Please try again later.`,
    WRONG_PNONE_NUMBER: `It looks like you've entered the wrong phone number. Please make sure your phone number is correct according to your country code.`,
    UNVERIFIED_ACCOUNT:
      "Your account is inactive. Click the below verification link to verify your account.",
    INVALID_OTP_TOKEN: (min, max) => `Token must be ${max} character long.`,
    USER_NOT_FOUND: `The credentials you provided are invalid. Could you please try again with valid credentials`,
    INVALID_OTP:
      "The number that you've entered doesn't match your code. Please try again.",
    NETOWRK_PROBLEM_ERROR: `We are facing some network problems to send emails or messages.`,
    ACCOUNT_NOT_FOUND: (value, value1) =>
      `Couldn’t find any account associated with ${value1.toLowerCase()}:${value}`,
    PHONE_INVALID_PREVIOUS:
      "This latest update allows users to recover password through both phone and e-mail. The users who had signed up before this phone number verification we recommend you to choose e-mail option to recover their account.",
    WRONG_OTP_CODE: "It's look like you've entered the wrong otp.",
    WRONG_OLD_PASSWORD: "You entered the wrong old password",
    OTP_CODE_EXPIRED:
      "Your OTP code has been expired. Click on resend to get new code",
    OTP_CODE_EXPIRED_UPDATE_PASSWORD:
      "Your OTP code has been expired. Please go back and repeat the process again to update the password.",
  },

  GENERIC_ERROR: {
    OPERATION_FAIL: (operationName, error) =>
      `${operationName} operation fail.We are facing some internal server issues.Please try again later.${
        error ? error : ""
      }`,
    RECORD_NOT_FOUND: (record) =>
      `There is no record found against this : ${record}.`,
    INTERNEL_SERVER_ERROR:
      "There is some internal server error.Please try again letter",
    INVALID_HASH: (address) =>
      `This hash you provide not contain any transaction on our deposit address: ${address}.`,
  },
  ADMIN: {
    INVALID_ADDRESS_TYPE: "Invalid deposit address type only allow btc | eth",
    INVALID_WALLET_ADDRESS: (user) => `${user} address is invalid`,
    TRANSACTION_PENDING_ERROR:
      "Your transaction in not confrmed when it's confimred then please deposit hash",
    HASH_ALREADY_USED_ERROR: (hash, wallet) =>
      `It appears that the hash you entered has already been utilized. We have completed the transfer of ${hash} USB to the account ${wallet} using that hash. To continue, please provide an alternative hash.`,

    INVALID_HASH: (address) =>
      `This hash you provide not contain any transaction on our deposit address: ${address}.`,

    BTC_PEDNING_HASH_ERROR:
      "To purchase a USB using Bitcoin, you need to ensure that your Bitcoin transaction receives at least one confirmation. This means that the transaction needs to be verified by the Bitcoin network and added to the blockchain before it can be considered valid.",
  },
  USER: {
    INVALID_ADDRESS: (value) => `${value} address is invalid`,
  },
};

module.exports = {
  ErrorMessages: ErrorMessages,
};
