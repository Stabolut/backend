const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// Create Schema
const WalletSchema = new Schema({
    account: {
        type: String,
        required: true,
    },
    btcWallet: {
        type: String
    },

    tokenArray: [{
        token: String

    }],
    balance: {
        type: Number
    },


    timestamps: { created_At: { type: Date, default: Date.now }, updated_At: { type: Date, default: Date.now } },

});

let WalletModel = mongoose.model("wallet", WalletSchema);

module.exports = WalletModel


