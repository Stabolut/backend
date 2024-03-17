const mongoose = require("mongoose");
const { MONGO_URL } = require("../config");

const connectToMongo = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    console.log("Retrying connection to MongoDB...");
    setTimeout(connectToMongo, 5000);
  }
};

module.exports = connectToMongo;
