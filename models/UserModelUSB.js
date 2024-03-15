const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const validator = require("validator")
const { ErrorMessages } = require("../constants/errors")

// Create Schema
const USBUserModleSchema = new Schema({
    email: {
        type: String,
        validate: [validator.isEmail, JSON.stringify(ErrorMessages.AUTH.VALIDATION_FAILED("email"))],
        lowercase: true,
        unique: true
    },
    username: {
        type: String,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    fullName: {
        type: String,
        required: true,
    },
    Verified: {
        type: Boolean,
        default: true
    },
    otp_token: {
        type: Number,
        required: true

    },
    otp_create_time: {
        type: Date,
        required: true
    },
    timestamps: { created_At: { type: Date, default: Date.now }, updated_At: { type: Date, default: Date.now } },

});

let UserModelUSB = mongoose.model("user_USB", USBUserModleSchema);

module.exports = UserModelUSB


