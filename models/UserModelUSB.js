// Importing the mongoose library
const mongoose = require("mongoose");
// Getting the Schema object from mongoose
const Schema = mongoose.Schema;
// Importing validator library for data validation
const validator = require("validator");
// Importing error messages constants
const { errorMessages } = require("../constants/errors");

// Define the schema for the USBUserModle document
const USBUserModleSchema = new Schema({
  // Field to store the email address
  email: {
    type: String,
    // Validate email format using validator
    validate: [
      validator.isEmail,
      JSON.stringify(errorMessages.AUTH.VALIDATION_FAILED("email")),
    ],
    lowercase: true,
    unique: true, // Ensure uniqueness of email addresses
  },
  // Field to store the username
  username: {
    type: String,
    lowercase: true,
    unique: true, // Ensure uniqueness of usernames
  },
  // Field to store the password (select: false to exclude from query results by default)
  password: {
    type: String,
    required: true,
    select: false,
  },
  // Field to store the full name
  fullName: {
    type: String,
    required: true,
  },
  // Field to indicate user verification status
  Verified: {
    type: Boolean,
    default: true, // Default value set to true
  },
  // Field to store OTP token
  otp_token: {
    type: Number,
    required: true,
  },
  // Field to store OTP creation time
  otp_create_time: {
    type: Date,
    required: true,
  },
  // Field to store timestamps for document creation and updation
  timestamps: {
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now },
  },
});

// Creating a model based on the schema
let userModelUSB = mongoose.model("user_USB", USBUserModleSchema);

// Exporting the model for use in other parts of the application
module.exports = userModelUSB;
