// Importing required modules and models
const userModel = require("../models/userModel");
const { isValidEthereumAddress } = require("../utils/wallet");
const { errorMessages } = require("../constants/errors");
const contactListModel = require("../models/contactListModel");
const { infoMessages } = require("../constants/messages");
const apiError = require("../error/apiError");

/**
 * Retrieves a user by their wallet account or username.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} An object containing the message and data of the retrieved user.
 */
const retrieveUserByWalletOrUsername = async (req, res) => {

  const existingUser = await userModel.findOne({
    $or: [{ account: req.body.userID }, { username: req.body.userID.toLowerCase() }],
  });

  if (existingUser) {
    return {
      message: infoMessages.GENERIC.RECORD_FOUND(req.body.userID),
      data: existingUser,
    };
  } else {
    // User not found, return appropriate message
    return {
      message: infoMessages.GENERIC.RECORD_NOT_FOUND(req.body.userID),
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

  const usernameExist = await userModel.findOne({ username: req.body.username.toLowerCase() });
  if (usernameExist) throw new apiError(errorMessages.AUTH.USERNAME_ALREADY_EXIST(req.body.username))
  const accountExist = await userModel.findOne({ account: req.body.accountID });

  if (accountExist) {

    await userModel.updateOne({ account: req.body.accountID }, {
      $set: { username: req.body.username.toLowerCase() }
    });

    return

  }


  // Create a new user with the provided username and account
  const newUser = new userModel({
    account: req.body.accountID,
    username: req.body.username.toLowerCase(),
  });
  await newUser.save();
  return;

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
    throw new apiError(errorMessages.USER.INVALID_ADDRESS("Receiver"), 404);

  if (!isValidEthereumAddress(req.body.senderAccount))
    throw new apiError(errorMessages.USER.INVALID_ADDRESS("Sender"), 404);

  // // Check if the contact already exists
  const accountExist = await contactListModel.findOne({
    receiver_account: { $regex: new RegExp(`^${req.body.receiverAccount}$`, 'i') },
    sender_account:{ $regex: new RegExp(`^${req.body.senderAccount}$`, 'i') },
  });


  if (accountExist) {
    throw new apiError(
      `Contact already exists with this address: ${req.body.receiverAccount}`,
      404
    );
  }

  // Check if the contact already exists
  const nameExist = await contactListModel.findOne({
    sender_account: { $regex: new RegExp(`^${req.body.senderAccount}$`, 'i') },
    name: req.body.name.toLowerCase(),
  });

  if (nameExist) {
    throw new apiError(
      `Contact already exists with this name: ${nameExist.name}`,
      404
    );
  }


  // Create and save the new contact
  const newContact = new contactListModel({
    receiver_account: req.body.receiverAccount,
    sender_account: req.body.senderAccount,
    name: req.body.name.toLowerCase(),
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

  const contactList = await contactListModel.find({
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
