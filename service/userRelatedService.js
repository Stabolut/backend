// Importing required modules and models
const UserModel = require("../models/UserModel");
const { isValidEthereumAddress } = require("../utils/wallet");
const { ErrorMessages } = require("../constants/errors");
const ContactListModel = require("../models/ContactList");
const { InfoMessages } = require("../constants/messages");
const ApiError = require("../error/ApiError");

/**
 * Retrieves a user by their wallet account or username.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} An object containing the message and data of the retrieved user.
 */
const retrieveUserByWalletOrUsername = async (req, res) => {
  const existingUser = await UserModel.findOne({
    $or: [{ account: req.body.userID }, { username: req.body.userID }],
  });

  if (existingUser) {
    return {
      message: InfoMessages.GENERIC.RECORD_FOUND(req.body.userID),
      data: existingUser,
    };
  } else {
    // User not found, return appropriate message
    return {
      message: InfoMessages.GENERIC.RECORD_NOT_FOUND(req.body.userID),
      data: null,
    };
  }
};

/**
 * Assigns a username to a wallet account.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @throws {ApiError} If username already exists for the given account.
 */
const assignUsernameToWallet = async (req, res) => {
  const existingUser = await UserModel.findOne({ account: req.body.accountID });

  if (existingUser) {
    throw new ApiError(
      `Username already exists for this account: ${existingUser.username}`,
      404
    );
  } else {
    // Create a new user with the provided username and account
    const newUser = new UserModel({
      account: req.body.accountID,
      username: req.body.username,
    });
    await newUser.save();
    return;
  }
};

/**
 * Adds a new contact to the contact list.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @throws {ApiError} If invalid Ethereum addresses are provided or contact already exists.
 * @returns {object} The newly added contact.
 */
const addContactList = async (req, res) => {
  if (!isValidEthereumAddress(req.body.receiverAccount))
    throw new ApiError(ErrorMessages.USER.INVALID_ADDRESS("Receiver"), 404);

  if (!isValidEthereumAddress(req.body.senderAccount))
    throw new ApiError(ErrorMessages.USER.INVALID_ADDRESS("Sender"), 404);

  // Check if the contact already exists
  const accountExist = await ContactListModel.findOne({
    receiver_account: req.body.receiverAccount,
    sender_account: req.body.senderAccount,
  });

  if (accountExist) {
    throw new ApiError(
      `Contact already exists with this name: ${accountExist.name}`,
      404
    );
  }

  // Create and save the new contact
  const newContact = new ContactListModel({
    receiver_account: req.body.receiverAccount,
    sender_account: req.body.senderAccount,
    name: req.body.name,
  });
  await newContact.save();
  return newContact;
};

/**
 * Retrieves the contact list for a given user account.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object[]} An array containing the contact list information.
 */
const getContactListInfo = async (req, res) => {
  const contactList = await ContactListModel.find({
    sender_account: req.body.account,
  }).sort({ "timestamps.created_At": -1 });
  return contactList;
};

// Exporting the service functions for use in other parts of the application
module.exports = {
  retrieveUserByWalletOrUsername,
  assignUsernameToWallet,
  addContactList,
  getContactListInfo,
};
