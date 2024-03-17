// Importing the mongoose library
const mongoose = require("mongoose");
// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for the User document
const UserSchema = new Schema({
  // Field to store the user's account
  account: {
    type: String,
    required: true,
  },
  // Field to store the username
  username: {
    type: String,
    required: true,
  },
  // Field to store timestamps for document creation and updation
  timestamps: {
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now },
  },
});

// Creating a model based on the schema
let UserModel = mongoose.model("user", UserSchema);

// Exporting the model for use in other parts of the application
module.exports = UserModel;
