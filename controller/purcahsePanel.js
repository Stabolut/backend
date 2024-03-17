// Importing the purchasePanelService module which contains functions related to purchasing panel
const purchase = require("../service/purchasePanelService");
// Importing the sendSuccessResponse function from the responses utility module
const { sendSuccessResponse } = require("../utils/responses");
// Importing InfoMessages constant from the messages constants module
const { InfoMessages } = require("../constants/messages");

// Function to get the deposit address
getDepositAddress = async (req, res) => {
  // Call the getDepositAddress function from the purchasePanelService module and await its response
  const depositAddress = await purchase.getDepositAddress(req);
  // Send a success response with the deposit address received from the getDepositAddress function
  return sendSuccessResponse(
    res,
    InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Admin deposit address"),
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

// Exporting the functions so they can be used elsewhere
module.exports = {
  getDepositAddress,
  purchaseUSBWithEther,
  purchaseUSBWithBtc,
};
