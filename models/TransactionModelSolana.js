const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// Create Schema
const transactionSolanaSchema = new Schema({
  explorer_url: {
    type: String,
    required: true,
  },
  
  sendDate:
    { type: Date, default: Date.now },

  timestamps: { created_At: { type: Date, default: Date.now }, updated_At: { type: Date, default: Date.now } },

});

let TransactionModelSolana = mongoose.model("transaction-solana", transactionSolanaSchema);

module.exports = TransactionModelSolana


