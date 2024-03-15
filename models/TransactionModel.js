const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// Create Schema
const transactionSchema = new Schema({
  senderAddress: {
    type: String,
    required: true,
  },
  receiverAddress: {
    type: String,
    required: true,
  },
  amountToSend: {
    type: Number,
    required: true,
  },
  transactionStatus: {
    type: String,
    default: "Pending",

  },
  transactionHash:
  {
    type: String,
    required: true,
  },
  transactionType:
  {
    type: String,
    default: "Transfer",
  },
  transactionNotes: {
    type: String,
    required: false,
  },
  sendDate:
    { type: Date, default: Date.now },

  timestamps: { created_At: { type: Date, default: Date.now }, updated_At: { type: Date, default: Date.now } },

});

let TransactionModel = mongoose.model("transaction", transactionSchema);

module.exports = TransactionModel


