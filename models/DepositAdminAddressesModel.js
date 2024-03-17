// Importing required modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the DepositAdminModel document
const DepositAdminModelSchema = new Schema({
  // Field to store the deposit address
  depositAddress: {
    type: String,
    unique: true, // Ensuring uniqueness of deposit addresses
  },
  // Field to indicate whether the address is active or not
  isActive: {
    type: Boolean,
  },
  // Field to store timestamps for document creation and updation
  timestamps: {
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now },
  },
});

// Creating a model based on the schema
let DepositAdminModel = mongoose.model(
  "deposit_admin_address",
  DepositAdminModelSchema
);

// Exporting the model for use in other parts of the application
module.exports = DepositAdminModel;
