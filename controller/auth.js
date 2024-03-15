const {
  errorResponse,
  routeResponseOnlyMessage,
  routeResponseWithData,
} = require("../utils/responses");
const { ErrorMessages } = require("../constants/errors");
const {
  getInformationByUniqueId,
  getUserByUsernameAndPassword,
} = require("../authQuery/auth");
const UserModelUSB = require("../models/UserModelUSB");
const { generateOTP } = require("../utils/helperMethod");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { SESSION_EXPIRES_IN, JWT_SECRET_KEY } = require("../config");
const { InfoMessages } = require("../constants/messages");

registerUser = async (req, res) => {
  try {
    // check username exist
    let username = await getInformationByUniqueId(
      "username",
      req.body.username.toLowerCase(),
      UserModelUSB
    );
    if (username)
      return errorResponse(
        res,
        ErrorMessages.AUTH.USERNAME_ALREADY_EXIST(req.body.username),
        400
      );
    //check email aready exist
    let email = await getInformationByUniqueId(
      "email",
      req.body.email.toLowerCase(),
      UserModelUSB
    );
    if (email)
      return errorResponse(
        res,
        ErrorMessages.AUTH.EMAIL_ALREADY_EXIST(req.body.email),
        400
      );

    const USBUserModle = new UserModelUSB({
      username: req.body.username,
      fullName: req.body.name,
      email: req.body.email,
      password: CryptoJS.SHA256(req.body.password).toString(CryptoJS.enc.Hex),
      otp_token: generateOTP(),
      otp_create_time: moment().format("YYYY-MM-DD  HH:mm:ss"),
    });
    await USBUserModle.save();
    return routeResponseOnlyMessage(
      res,
      true,
      InfoMessages.GENERIC.ITEM_CREATED_SUCCESSFULLY("user")
    );
  } catch (e) {
    console.log("e", e);
    return errorResponse(
      res,
      ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("createBtcWallet", e.message),
      500
    );
  }
};

loggedInUser = async (req, res) => {
  try {
    // decrypt password
    var hash = CryptoJS.SHA256(req.body.password).toString(CryptoJS.enc.Hex);

    // get user by username and password
    let account = await getUserByUsernameAndPassword(req.body.username, hash);
    if (!account)
      return errorResponse(res, ErrorMessages.AUTH.USER_NOT_FOUND, 400);
    const jwtToken = jwt.sign(
      { username: req.body.username, id: account._id },
      JWT_SECRET_KEY,
      { expiresIn: SESSION_EXPIRES_IN }
    );

    return routeResponseWithData(
      res,
      true,
      InfoMessages.AUTH.LOGIN_MESSAGE,
      { token: jwtToken },
      200
    );
  } catch (e) {
    console.log("e", e);
    return errorResponse(
      res,
      ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("createBtcWallet", e.message),
      500
    );
  }
};

module.exports = {
  registerUser,
  loggedInUser,
};
