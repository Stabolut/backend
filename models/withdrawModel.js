// Importing the mongoose library
const mongoose = require("mongoose");
// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for the Wallet document
const withdrawModelSchema = new Schema({
  // Field to store the account associated with the wallet
  usbAmountToWithdraw: {
    type: Number,
    required: true,
  },

  // Field to store the balance of the wallet
  amountToSend: {
    type: Number,
  },
  walletAddress: {
    type: String

  },
  ethTransactionHash: {
    type: String,
  },
  usbTransactionHash: {
    type: String,
  },
  btcTransactionHash: {
    type: String,
  },
  // Field to store timestamps for document creation and updation
  timestamps: {
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now },
  },
});

// Creating a model based on the schema
let withdrawModel = mongoose.model("withdraw", withdrawModelSchema);

// Exporting the model for use in other parts of the application
module.exports = withdrawModel;
