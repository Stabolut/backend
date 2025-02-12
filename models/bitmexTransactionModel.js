

// Importing the mongoose library
const mongoose = require("mongoose");
const Schema = mongoose.Schema;



// Create Schema for Admin Model
const bitmexTransactionModelSchema = new Schema({

    txid: {
        type: String,
    },
    address: {
        type: String,
    },
    amount: {
        type: Number,
    },
    confirmations: {
        type: Number,
    },
    timestamp: {
        type: Date,
    },
    // Timestamps for creation and last update of the admin document
    timestamps: {
        created_At: { type: Date, default: Date.now },
        updated_At: { type: Date, default: Date.now },
    },
});

// Create Mongoose Model for the 'admin' collection
let bitmexTransactionModel = mongoose.model("bitmex-transaction-tracking", bitmexTransactionModelSchema);

// Export the Admin Model for use in other modules

module.exports = bitmexTransactionModel;


