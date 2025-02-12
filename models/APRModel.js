

// Importing the mongoose library
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema for Admin Model
const APRModelSchema = new Schema({

    fundingRateDaily: {
        type: Number,
    },
    // Timestamps for creation and last update of the admin document
    timestamps: {
        created_At: { type: Date, default: Date.now },
        updated_At: { type: Date, default: Date.now },
    },
});

// Create Mongoose Model for the 'admin' collection
let APRModel = mongoose.model("fundRate", APRModelSchema);

// Export the Admin Model for use in other modules

module.exports = APRModel;

