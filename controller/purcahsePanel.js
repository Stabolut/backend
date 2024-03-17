// Import necessary modules and services
const admin = require("../service/purchasePanelService");
const { sendSuccessResponse } = require("../utils/responses");
const { InfoMessages } = require("../constants/messages");

// Controller function to get deposit address
getDepositAddress = async (req, res) => {
  // Call service function to retrieve deposit address
  const depositAddress = await admin.getDepositAddress(req);
  // Send success response with deposit address
  return sendSuccessResponse(
    res,
    InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Admin deposit address"),
    200,
    depositAddress
  );
};

// Controller function to purcahse usb with ether
purchaseUSBWithEther = async (req, res) => {
  // Call service function to purcahse usb with ether
  const purcahse = await admin.purchaseUSBWithEther(req);
  // Send success response with deposit address
  return sendSuccessResponse(res, purcahse, 200);
};

// Controller function to purcahse usb with ether
purchaseUSBWithBtc = async (req, res) => {
  // Call service function to purcahse usb with ether
  const purcahse = await admin.purchaseUSBWithBtc(req);
  // Send success response with deposit address
  return sendSuccessResponse(res, purcahse, 200);
};

// Export controller function
module.exports = {
  getDepositAddress,
  purchaseUSBWithEther,
  purchaseUSBWithBtc,
};
