// Importing the mongoose library
const mongoose = require("mongoose");
// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for the Subscribe document
const SubscribeSchema = new Schema({
  // Field to store the email address
  email: {
    type: String,
    required: true,
  },
  // Field to store the name
  name: {
    type: String,
    required: true,
  },
  // Field to store the company name
  companyName: {
    type: String,
    required: true,
  },
  // Field to indicate whether APK is sent or not
  apkSent: {
    default: false,
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
let SubscribeModel = mongoose.model("subscribe", SubscribeSchema);

// Exporting the model for use in other parts of the application
module.exports = SubscribeModel;
