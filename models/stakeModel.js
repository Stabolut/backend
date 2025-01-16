// Importing the mongoose library
const mongoose = require("mongoose");
// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for the Stake document
const stakeSchema = new Schema({
  // Field to store the wallet address
  wallet: {
    type: String,
    required: true,
  },
  // Field to store the yield amount
  rewardAmountOnStaking: {
    type: Number,
    required: false,
  },
  // Field to store the stake amount
  amount: {
    type: Number,
    required: true,
  },
  // Field to store the transaction hash
  hash: {
    type: String,
    required: true,
  },
  withdraw: {
    type: Boolean,
    required: false,
  },

  lastRewardGiven_At: { type: Date, default: null }, // Last reward time
  // Field to store timestamps for document creation and updation
  timestamps: {
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now },
  },
});

// Creating a model based on the schema
let stakeModel = mongoose.model("stake", stakeSchema);

// Exporting the model for use in other parts of the application
module.exports = stakeModel;
