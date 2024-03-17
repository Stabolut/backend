// Importing the generalService module which contains functions related to common services
const commonService = require("../service/generalService");
// Importing the sendSuccessResponse function from the responses utility module
const { sendSuccessResponse } = require("../utils/responses");

// Function to handle sending email to contact user
sendContactUserEmail = async (req, res) => {
  // Call the contactUsEmail function from the generalService module and await its response
  let msg = await commonService.contactUsEmail(req);

  // Send a success response with the message received from the contactUsEmail function
  return sendSuccessResponse(res, msg, 200);
};

// Function to handle subscription
subscribe = async (req, res) => {
  // Call the subscribedEmail function from the generalService module and await its response
  let msg = await commonService.subscribedEmail(req);
  // Send a success response with the message received from the subscribedEmail function
  return sendSuccessResponse(res, msg, 200);
};

// Exporting the functions so they can be used elsewhere
module.exports = {
  sendContactUserEmail,
  subscribe,
};
