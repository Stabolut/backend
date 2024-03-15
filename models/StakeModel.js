const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// Create Schema
const StakeSchema = new Schema({
    wallet: {
        type: String,
        required: true,
    },
    yieldAmount: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    hash: {
        type: Number,
        required: true,

    },
    // mobile: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    timestamps: { created_At: { type: Date, default: Date.now }, updated_At: { type: Date, default: Date.now } },

});

let StakeModel = mongoose.model("stake", StakeSchema);

module.exports = StakeModel


