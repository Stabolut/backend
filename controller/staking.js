// Importing the stakingService module which contains functions related to staking
const stakingService = require("../service/stakingService");
// Importing the sendSuccessResponse function from the responses utility module
const { sendSuccessResponse } = require("../utils/responses");
// Importing infoMessages constant from the messages constants module
const { infoMessages } = require("../constants/messages");

// Function to add stake
addInStake = async (req, res) => {
  // Call the addInStake function from the stakingService module and await its response
  let stake = await stakingService.addInStake(req);

  // Send a success response with the stake details received from the addInStake function
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_ADD_SUCCESSFULLY("Stake"),
    200,
    stake
  );
};

// Function to get stake details
getInStake = async (req, res) => {

  // Call the getStakeList function from the stakingService module and await its response
  let stakeList = await stakingService.getStakeList(req);
  // Send a success response with the list of stake details received from the getStakeList function
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Stake"),
    200,
    { stake: stakeList.stakeList, stakePercent: stakeList.stakePercent }
  );
};

// Function to get all stake transactions
stakeTransactions = async (req, res) => {
  // Call the allStakeTransactionList function from the stakingService module and await its response
  let list = await stakingService.allStakeTransactionList(req);

  // Send a success response with the list of all stake transactions received from the allStakeTransactionList function
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Stake transaction list"),
    200,
    list
  );
};

// Function to get stake rewards
stakeReward = async (req, res) => {
  // Call the stakeReward function from the stakingService module and await its response
  let contactList = await stakingService.stakeReward(req);

  // Send a success response with the list of stake rewards received from the stakeReward function
  return sendSuccessResponse(
    res,
    infoMessages.GENERIC.ITEM_GET_SUCCESSFULLY("Stake reward"),
    200,
    contactList
  );
};

// Exporting the functions so they can be used elsewhere
module.exports = {
  addInStake,
  getInStake,
  stakeTransactions,
  stakeReward,
};
