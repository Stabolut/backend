// Importing the mongoose library
const mongoose = require("mongoose");
// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for the Transaction document
const transactionSchema = new Schema({
  // Field to store the sender's address
  senderAddress: {
    type: String,
    required: true,
  },
  // Field to store the receiver's address
  receiverAddress: {
    type: String,
    required: true,
  },
  // Field to store the amount to send
  amountToSend: {
    type: Number,
    required: true,
  },
  // Field to store the status of the transaction
  transactionStatus: {
    type: String,
    default: "Pending",
  },
  // Field to store the transaction hash
  transactionHash: {
    type: String,
    required: true,
  },
  // Field to specify the type of transaction
  transactionType: {
    type: String,
    default: "Transfer",
  },
  // Field to store any notes related to the transaction
  transactionNotes: {
    type: String,
    required: false,
  },
  // Field to store the date of transaction
  sendDate: { type: Date, default: Date.now },

  network: {
    type: String,

  },
  // Field to store timestamps for document creation and updation
  timestamps: {
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now },
  },
});

// Creating a model based on the schema
let transactionModel = mongoose.model("transaction", transactionSchema);

// Exporting the model for use in other parts of the application
module.exports = transactionModel;
