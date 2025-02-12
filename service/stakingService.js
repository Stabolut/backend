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
const { NETWORKS } = require("../config");
const APRModel = require("../models/APRModel");
const { getWebInstance } = require("../utils/utils");

/**
 * Adds a new stake entry with specified details.
 * @param {object} req - The request object containing stake details.
 * @returns {object} Object containing the calculated yield amount.
 */
const addInStake = async (req, res) => {
  const { amount, wallet, signature, toAddress, amountToSend, nonce1, network } =
    req.body;
  let networkInfo = NETWORKS[network]
  let web3Instance = getWebInstance(network)

  let aprValue = await APRModel.findOne({}).sort({ 'timestamps.created_At': -1 });
  const yieldAmount = amount * aprValue.fundingRateDaily;
  const gasPrice = (await getGasPrice(web3Instance)) * 2;
  const nonce = await getNonce(networkInfo.fundingAddress, web3Instance);

  // Encode transaction data
  const encoded_tx = await transferPreSignedHex(
    signature,
    toAddress,
    parseInt(amountToSend),
    parseInt(nonce1),
    networkInfo.contractAddress,
    web3Instance
  );

  // Estimate gas limit
  let estimateTransactionObject = {
    nonce: web3Instance.utils.toHex(nonce),
    from: networkInfo.fundingAddress,
    gasPrice: web3Instance.utils.toHex(gasPrice),
    to: networkInfo.contractAddress,
    data: encoded_tx,
  };
  const gasLimit = await web3Instance.eth.estimateGas(estimateTransactionObject);

  // Build transaction object
  let transactionObject = {
    nonce: web3Instance.utils.toHex(nonce),
    from: networkInfo.fundingAddress,
    gasPrice: web3Instance.utils.toHex(gasPrice),
    gasLimit: web3Instance.utils.toHex(gasLimit),
    to: networkInfo.contractAddress,
    data: encoded_tx,
  };

  // Sign and send the transaction
  const hash = await signAndSendTransaction(transactionObject, networkInfo.fundingKey, web3Instance);
  console.log("hash", hash)

  // Save stake details
  const staking = new stakeModel({
    amount,
    wallet,
    hash: hash.transactionHash,
    network
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
  console.log("reeeee", req.body)
  let stakeList = await stakeModel.aggregate([
    { $match: { wallet: req.body.account, network: req.body.network } },
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

  // If no stake records found, return empty array
  if (stakeList.length === 0) {
    stakeList = [{ totalAmountInStake: 0, stakeBucketsList: [], totalRewardOnStake: 0 }];
  }

  let aprValue = await APRModel.findOne({}).sort({ 'timestamps.created_At': -1 });
  let apr = aprValue ? ((aprValue.fundingRateDaily * 365) * 100).toFixed(2) : 0;


  return {
    stakeList: stakeList,
    apr

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

getAPR = async (req, res) => {
  let reward = await APRModel.findOne({}).sort({ 'timestamps.created_At': -1 });
  return ((reward.fundingRateDaily * 365) * 100).toFixed(2);
};


// Export the controller functions
module.exports = {
  addInStake,
  getStakeList,
  allStakeTransactionList,
  stakeReward,
  getAPR
};
