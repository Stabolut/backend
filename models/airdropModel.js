// Importing the mongoose library
const mongoose = require("mongoose");
// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for the purchase transaction
const airdropSchema = new Schema({
    // Field to store the amount of USB sent in purchase
    airdropAmount: {
        type: Number
    },
    // Field to store the amount received in crypto
    userBalance: {
        type: Number
    },
    // Field to store the USD exchange rate
    walletAddress: {
        type: String
    },
    // Field to store the transaction hash
    transactionHash: {
        type: String
    },
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
let airdropModel = mongoose.model("airdrop", airdropSchema);

// Exporting the model for use in other parts of the application
module.exports = airdropModel;
