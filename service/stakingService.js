// Import required modules and models
const automateStakeModel = require("../models/automateStakeModel");
const { isEmpty } = require("lodash");
const {
  getGasPrice,
  getNonce,
  signAndSendTransaction,
  transferPreSignedHex,
} = require("../utils/wallet");
const stakeModel = require("../models/stakeModel");
const { CONTRACT_ADDRESS, FUNDING_ADDRESS, FUNDING_KEY, STAKE_REWRD_PERCENT } = require("../config");

/**
 * Adds a new stake entry with specified details.
 * @param {object} req - The request object containing stake details.
 * @returns {object} Object containing the calculated yield amount.
 */
const addInStake = async (req, res) => {
  const { amount, wallet, signature, toAddress, amountToSend, nonce1 } =
    req.body;
  console.log("req.body", req.body)
  const yieldAmount = (amount * STAKE_REWRD_PERCENT) / 100; // Calculate yield
  console.log("req.body", yieldAmount)

  // Calculate gas price
  const gasPrice = (await getGasPrice()) * 1.3;

  // Get nonce for transaction
  const nonce = await getNonce(FUNDING_ADDRESS);

  // Encode transaction data
  const encoded_tx = await transferPreSignedHex(
    signature,
    toAddress,
    parseInt(amountToSend),
    parseInt(nonce1)
  );

  // Estimate gas limit
  let estimateTransactionObject = {
    nonce: global.web3.utils.toHex(nonce),
    from: FUNDING_ADDRESS,
    gasPrice: global.web3.utils.toHex(gasPrice),
    to: CONTRACT_ADDRESS,
    data: encoded_tx,
  };
  const gasLimit = await global.web3.eth.estimateGas(estimateTransactionObject);

  // Build transaction object
  let transactionObject = {
    nonce: global.web3.utils.toHex(nonce),
    from: FUNDING_ADDRESS,
    gasPrice: global.web3.utils.toHex(gasPrice),
    gasLimit: global.web3.utils.toHex(gasLimit),
    to: CONTRACT_ADDRESS,
    data: encoded_tx,
  };

  // Sign and send the transaction
  const hash = await signAndSendTransaction(transactionObject, FUNDING_KEY);
  console.log("hash", hash)

  // Save stake details
  const staking = new stakeModel({
    amount,
    wallet,
    hash: hash.transactionHash,
  });
  await staking.save();

  // Return yield amount
  return { yieldAmount };
};

/**
 * Retrieves stake list for a specific wallet.
 * @param {object} req - The request object containing wallet information.
 * @returns {array} List of stake transactions for the specified wallet.
 */
const getStakeList = async (req, res) => {
  let stakeList = await stakeModel.aggregate([
    { $match: { wallet: req.body.account } },
    { $sort: { "timestamps.created_At": -1 } },
    {
      $group: {
        _id: null,
        totalAmountInStake: { $sum: "$amount" },
        totalRewardOnStake: { $sum: "$rewardAmountOnStaking" },
        stakeBucketsList: { $push: "$$ROOT" },
      },
    },
  ]);
console.log("stakeList",stakeList)
  // If no stake records found, return empty array
  if (stakeList.length === 0) {
    stakeList = [{ totalAmountInStake: 0, stakeBucketsList: [],stakePercent: STAKE_REWRD_PERCENT,totalRewardOnStake:0 }];
  }
  console.log("stakeList",stakeList,STAKE_REWRD_PERCENT)
  
  return {
    stakeList: stakeList,
    stakePercent: STAKE_REWRD_PERCENT
  };
};

/**
 * Retrieves all stake transaction list for a specific wallet.
 * @param {object} req - The request object containing wallet information.
 * @returns {array} List of all stake transactions for the specified wallet.
 */
const allStakeTransactionList = async (req, res) => {
  let stakeList = [];

  // Check if query parameters are provided
  if (!isEmpty(req.query)) {
    stakeList = await automateStakeModel.aggregate([
      { $match: { wallet: req.body.wallet } },
      { $sort: { "timestamps.created_At": -1 } },
      { $limit: parseInt(req.query.limit) },
    ]);
  } else {
    stakeList = await automateStakeModel.aggregate([
      { $match: { wallet: req.body.wallet } },
      { $sort: { "timestamps.created_At": -1 } },
    ]);
  }
  return stakeList;
};

/**
 * Calculates total stake reward for a specific wallet.
 * @param {object} req - The request object containing wallet information.
 * @returns {number} Total stake reward amount for the specified wallet.
 */
const stakeReward = async (req, res) => {
  let totalAmount = 0;
  let stakeList = await automateStakeModel.aggregate([
    { $match: { wallet: req.body.wallet } },
    {
      $group: {
        _id: null,
        rewardAmount: { $sum: "$rewardAmount" },
      },
    },
  ]);

  // Calculate total reward amount if stake transactions found
  if (stakeList.length > 0) {
    totalAmount = stakeList[0].rewardAmount;
  }
  return totalAmount;
};

// Export the controller functions
module.exports = {
  addInStake,
  getStakeList,
  allStakeTransactionList,
  stakeReward,
};
