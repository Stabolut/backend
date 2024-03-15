const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const validator = require("validator")
const { ErrorMessages } = require("../constants/errors")

// Create Schema
const DepositAdminModelSchema = new Schema({

    depositAddress: {
        type: String,
        unique: true
    },
    isActive: {
        type: Boolean,

    },

    timestamps: { created_At: { type: Date, default: Date.now }, updated_At: { type: Date, default: Date.now } },

});

let DepositAdminModel = mongoose.model("deposit_admin_address", DepositAdminModelSchema);

module.exports = DepositAdminModel


