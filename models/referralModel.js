// Importing the mongoose library
const mongoose = require("mongoose");

// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for the AutomateStake document
const referralSchema = new Schema({
    // Field to store the wallet address
    refferalWallet: {
        type: String,
      
    },
    // Field to store the reward amount
    referenceWallet: {
        type: String,
      
    },


    // Field to indicate whether the reward transfer is done
    isRewardTransfer: {
        type: Boolean,
        default: false,
    },
    transactionHash:{
        type: String,
    },


    timestamps: {
        created_At: { type: Date, default: Date.now },
        updated_At: { type: Date, default: Date.now },
    },
});

// Creating a model based on the schema
let referralModel = mongoose.model("referral", referralSchema);

// Exporting the model for use in other parts of the application
module.exports = referralModel;
