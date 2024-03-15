const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// Create Schema
const ContactListSchema = new Schema({
    receiver_account: {
        type: String,
        required: true,
    },
    sender_account: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    // mobile: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    timestamps: { created_At: { type: Date, default: Date.now }, updated_At: { type: Date, default: Date.now } },

});

let ContactListModel = mongoose.model("contact_list", ContactListSchema);

module.exports = ContactListModel


