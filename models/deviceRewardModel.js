// Importing the mongoose library
const mongoose = require("mongoose");
// Getting the Schema object from mongoose
const Schema = mongoose.Schema;

// Define the schema for device reward claim
const deviceRewardSchema = new Schema({
  // Field to store the device ID
  deviceId: {
    type: String,
    required: true,
  },
  // Field to store whether reward is claimed
  isRewardClaim: {
    type: Boolean,
    default: false,
  },
  // Field to store the time
  time: {
    type: Date,
    default: Date.now,
  },
  // Field to store timestamps for document creation and updation
  timestamps: {
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now },
  },
});

// Creating a model based on the schema
let deviceRewardModel = mongoose.model("deviceReward", deviceRewardSchema);

// Exporting the model for use in other parts of the application
module.exports = deviceRewardModel;