// Importing the purchasePanelService module which contains functions related to purchasing panel
const purchase = require("../service/purchasePanelService");
// Importing the sendSuccessResponse function from the responses utility module
const { sendSuccessResponse } = require("../utils/responses");
// Importing infoMessages constant from the messages constants module
const { infoMessages } = require("../constants/messages");

// Function to get the deposit address
getDepositAddress = async (req, res) => {
  // Call the getDepositAddress function from the purchasePanelService module and await its response
  const depositAddress = await purchase.getDepositAddress(req);
  // Send a success response with the deposit address received from the getDepositAddress function
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Admin deposit address"),
    200,
    depositAddress
  );
};

// Function to purchase USB with Ether
purchaseUSBWithEther = async (req, res) => {
  // Call the purchaseUSBWithEther function from the purchasePanelService module and await its response
  const msg = await purchase.purchaseUSBWithEther(req);
  // Send a success response with the purchase details received from the purchaseUSBWithEther function
  return sendSuccessResponse(res, msg, 200);
};

// Function to purchase USB with Bitcoin
purchaseUSBWithBtc = async (req, res) => {
  // Call the purchaseUSBWithBtc function from the purchasePanelService module and await its response
  const msg = await purchase.purchaseUSBWithBtc(req);
  // Send a success response with the purchase details received from the purchaseUSBWithBtc function
  return sendSuccessResponse(res, msg, 200);
};

// Function to check user wallet existance
checkUserWalletExistence = async (req, res) => {

  let isExist = await purchase.checkUserWalletExistence(req);
  return sendSuccessResponse(res, infoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("User wallet info"), 200, isExist);
};
loggedInAdminUser = async (req, res) => {
  let data = await purchase.loggedInAdminUser(req);
  return sendSuccessResponse(res, infoMessages.AUTH.LOGIN_MESSAGE, 200, data);

}
updatePassword = async (req, res) => {
  await purchase.updatePassword(req);
  return sendSuccessResponse(res, infoMessages.GENERIC.ITEM_ADD_SUCCESSFULLY("password"), 200);

}





// Exporting the functions so they can be used elsewhere
module.exports = {
  getDepositAddress,
  purchaseUSBWithEther,
  purchaseUSBWithBtc,
  checkUserWalletExistence,
  loggedInAdminUser,
  updatePassword
};
