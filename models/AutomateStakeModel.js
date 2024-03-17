// Importing the mongoose library
const mongoose = require("mongoose");

// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for the AutomateStake document
const AutomateStakeSchema = new Schema({
  // Field to store the wallet address
  wallet: {
    type: String,
    required: true,
  },
  // Field to store the reward amount
  rewardAmount: {
    type: Number,
    required: true,
  },
  // Field to store the reward percentage
  rewardPercentage: {
    type: Number,
    required: true,
  },
  // Field to store the stake amount
  stakeAmount: {
    type: Number,
    required: true,
  },
  // Field to store the transaction hash
  hash: {
    type: String,
    // required: true,
  },
  // Field to indicate whether the reward transfer is done
  isRewardTransfer: {
    type: Boolean,
    default: false,
  },
  // Field to store the status of reward transfer
  isRewardTransferSuccess: {
    type: String,
  },
  // Field to store timestamps for document creation and updation
  timestamps: {
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now },
  },
});

// Creating a model based on the schema
let AutomateStakeModel = mongoose.model("auto_stake", AutomateStakeSchema);

// Exporting the model for use in other parts of the application
module.exports = AutomateStakeModel;
