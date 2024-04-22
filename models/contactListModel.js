// Importing the mongoose library
const mongoose = require("mongoose");

// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for the ContactList document
const contactListSchema = new Schema({
  // Field to store the receiver's account
  receiver_account: {
    type: String,
    required: true,
  },
  // Field to store the sender's account
  sender_account: {
    type: String,
    required: true,
  },
  // Field to store the name associated with the contact
  name: {
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
let contactListModel = mongoose.model("contact_list", contactListSchema);

// Exporting the model for use in other parts of the application
module.exports = contactListModel;
