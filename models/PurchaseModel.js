// Importing the mongoose library
const mongoose = require("mongoose");
// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for the purchase transaction
const purchaseSchema = new Schema({
  // Field to store the amount of USB sent
  usbSend: {
    type: Number,
    required: true,
  },
  // Field to store the amount received
  receiveAmount: {
    type: Number,
    required: true,
  },
  // Field to store the USD exchange rate
  usdRate: {
    type: Number,
    required: true,
  },
  // Field to indicate the success status of the purchase transaction
  purchaseSuccessStatus: {
    type: Boolean,
    default: false,
  },
  // Field to store the wallet address used for the purchase
  purchaseUSBWallet: {
    type: String,
    required: true,
  },
  // Field to store the transaction hash
  transactionHash: {
    type: String,
    required: true,
  },
  // Field to store the transaction hash for USB
  transactionHashUSB: {
    type: String,
    required: true,
  },
  // Field to specify the type of purchase
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
let PurchaseModel = mongoose.model("purchase_transaction", purchaseSchema);

// Exporting the model for use in other parts of the application
module.exports = PurchaseModel;
