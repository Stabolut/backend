const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// Create Schema
const AutomateStakeSchema = new Schema({
    wallet: {
        type: String,
        required: true,
    },
    rewardAmount: {
        type: Number,
        required: true,
    },
    rewardPercentage:
    {
        type: Number,
        required: true,
    },
    stakeAmount: {
        type: Number,
        required: true,
    },
    hash: {
        type: String,
        // required: true,

    },
    isRewardTransfer: {
        type: Boolean,
        default: false
    },
    isRewardTransferSuccess: {
        type: String,

    },
    timestamps: { created_At: { type: Date, default: Date.now }, updated_At: { type: Date, default: Date.now } },

});

let AutomateStakeModel = mongoose.model("auto_stake", AutomateStakeSchema);

module.exports = AutomateStakeModel


