const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    account: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },
    timestamps: { created_At: { type: Date, default: Date.now }, updated_At: { type: Date, default: Date.now } },

});

let UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel


