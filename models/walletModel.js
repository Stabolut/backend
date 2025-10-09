// Importing the mongoose library
const mongoose = require("mongoose");
// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for the Wallet document
const walletSchema = new Schema({
  // Field to store the account associated with the wallet
  account: {
    type: String,
    required: true,
  },

  // Field to store an array of tokens associated with the wallet
  tokenArray: [
    {
      token: String,
    },
  ],
  // Field to store the balance of the wallet
  balance: {
    type: Number,
  },
  freeUSBCoinsBalance: {
    type: Number,
    default: 0

  },
  intialCoinTransfer: {
    type: Boolean,
    default: false

  },
  referralCode: {
    type: String,
  },
  referralLink: {
    type: String,

  },
  points: {
    type: Number,
    default: 0,
  },
  badges: [
    {
      title: { type: String, required: true }, // e.g., "First Transfer"
      rewardSent: { type: Boolean, default: false }, // Track if reward is sent
      earnedAt: { type: Date, default: Date.now }, // When the badge was earned
    },
  ],

  // Field to store timestamps for document creation and updation
  timestamps: {
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now },
  },
});

// Creating a model based on the schema
let walletModel = mongoose.model("wallet", walletSchema);

// Exporting the model for use in other parts of the application
module.exports = walletModel;
