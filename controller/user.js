// Importing the UserRelatedService module which contains functions related to user management
const userService = require("../service/UserRelatedService");
// Importing the sendSuccessResponse function from the responses utility module
const { sendSuccessResponse } = require("../utils/responses");
// Importing InfoMessages constant from the messages constants module
const { InfoMessages } = require("../constants/messages");

// Function to get user by wallet or username
getUserByWalletOrUsername = async (req, res) => {
  // Call the retrieveUserByWalletOrUsername function from the UserRelatedService module and await its response
  const user = await userService.retrieveUserByWalletOrUsername(req);

  // Send a success response with the user message and data received from the retrieveUserByWalletOrUsername function
  return sendSuccessResponse(res, user.message, 200, user.data);
};

// Function to assign username to wallet
assignUsernameToWallet = async (req, res) => {
  // Call the assingUsernameToWallet function from the UserRelatedService module and await its response
  await userService.assignUsernameToWallet(req);

  // Send a success response with the message indicating username assignment
  return sendSuccessResponse(res, InfoMessages.USER.USERNAME_ASSIGN, 200);
};

// Function to add contact list
addContactList = async (req, res) => {
  // Call the addContactList function from the UserRelatedService module and await its response
  let newUser = await userService.addContactList(req);

  // Send a success response with the message indicating successful addition of contact and the new user data
  return sendSuccessResponse(
    res,
    InfoMessages.GENERIC.ITEM_ADD_SUCCESSFULLY("Contact"),
    200,
    newUser
  );
};

// Function to get contact list
getContactList = async (req, res) => {
  // Call the getContactListInfo function from the UserRelatedService module and await its response
  let contactList = await userService.getContactListInfo(req);

  // Send a success response with the message indicating successful retrieval of contact info and the contact list data
  return sendSuccessResponse(
    res,
    InfoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Contact info"),
    200,
    contactList
  );
};

// Exporting the functions so they can be used elsewhere
module.exports = {
  getUserByWalletOrUsername,
  assignUsernameToWallet,
  addContactList,
  getContactList,
};
