// Importing the mongoose library
const mongoose = require("mongoose");
// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for the Wallet document
const WalletSchema = new Schema({
  // Field to store the account associated with the wallet
  account: {
    type: String,
    required: true,
  },
  // Field to store the BTC wallet address
  btcWallet: {
    type: String,
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
  // Field to store timestamps for document creation and updation
  timestamps: {
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now },
  },
});

// Creating a model based on the schema
let WalletModel = mongoose.model("wallet", WalletSchema);

// Exporting the model for use in other parts of the application
module.exports = WalletModel;
