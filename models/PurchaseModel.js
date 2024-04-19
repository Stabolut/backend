// Importing the mongoose library
const mongoose = require("mongoose");
// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for the purchase transaction
const purchaseSchema = new Schema({
  // Field to store the amount of USB sent in purchase
  usbSentAmount: {
    type: Number
  },
  // Field to store the amount received in crypto
  cryptoReceivedAmount: {
    type: Number
  },
  // Field to store the USD exchange rate
  conversionRate: {
    type: Number
  },
  // Field to indicate the  status of the purchase transaction
  transferStatus: {
    type: String,
    default: "Pending",
},
  // Field to store the wallet address used for the purchase
  userUSBWalletAddres: {
    type: String
  },
  // Field to store the transaction hash
  transactionHash: {
    type: String
  },
  // Field to store the transaction hash for USB
  transactionHashUSB: {
    type: String
  },
  // Field to specify the type of received crypto
  type: {
    type: String,
  },
  // Field to store timestamps for document creation and updation
  timestamps: {
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now },
  },
});

// Creating a model based on the schema
let purchaseModel = mongoose.model("purchase_transaction", purchaseSchema);

// Exporting the model for use in other parts of the application
module.exports = purchaseModel;
