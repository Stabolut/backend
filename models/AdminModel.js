/* 
  MongoDB Admin Table Schema
  This schema defines the structure of the 'admin' table in a MongoDB database.
  It outlines the fields, data types, validations, and default values for admin documents.
*/

// Importing the mongoose library
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator")

const ErrorMessages = require("../constants/errors.js")

// Create Schema for Admin Model
const AdminModleSchema = new Schema({
  // Email field with validation, lowercase conversion, and uniqueness constraint
  email: {
    type: String,
    validate: [
      validator.isEmail,
      // JSON.stringify(ErrorMessages.errorMessages.AUTH.VALIDATION_FAILED("email")),
      JSON.stringify(ErrorMessages.errorMessages.AUTH.VALIDATION_FAILED("email"))
    ],
    lowercase: true,
    unique: true,
  },

  // Password field with a requirement and exclusion from default queries
  password: {
    type: String,
    required: true,
    select: false,
  },

  // Type field to indicate the admin role (default: "admin")
  type: {
    type: String,
    required: true,
    default: "admin",
  },



  // Timestamps for creation and last update of the admin document
  timestamps: {
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now },
  },
});

// Create Mongoose Model for the 'admin' collection
let AdminModel = mongoose.model("admin", AdminModleSchema);

// Export the Admin Model for use in other modules

module.exports = AdminModel;

