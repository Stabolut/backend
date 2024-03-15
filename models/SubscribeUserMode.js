const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// Create Schema
const SubscribeSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },

    companyName: {
        type: String,
        required: true,
    },


    apkSent: {
        default:false,
        type: String,
        required: true,
    },
    timestamps: { created_At: { type: Date, default: Date.now }, updated_At: { type: Date, default: Date.now } },

});

let SubscribeModel = mongoose.model("subscribe", SubscribeSchema);

module.exports = SubscribeModel


