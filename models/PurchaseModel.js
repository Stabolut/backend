const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// Create Schema
const purchaseSchema = new Schema({

    usbSend: {
        type: Number,
        required: true,
    },
    receiveAmount: {
        type: Number,
        required: true,
    },
    usdRate: {
        type: Number,
        required: true,
    },
    purchaseSuccessStatus: {
        type: Boolean,
        default: false,
    },
    purchaseUSBWallet: {
        type: String,
        required: true,

    },
    transactionHash:
    {
        type: String,
        required: true,
    },
    transactionHashUSB:
    {
        type: String,
        required: true,
    },
    type: {
        type: String

    },
    timestamps: { created_At: { type: Date, default: Date.now }, updated_At: { type: Date, default: Date.now } },

});

let PurchasenModel = mongoose.model("purchase_transaction", purchaseSchema);

module.exports = PurchasenModel


