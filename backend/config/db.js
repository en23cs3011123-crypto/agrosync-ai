const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ Warning: MONGO_URI not set. Running in local fallback mode.");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log("✅ MongoDB Atlas connected successfully!");
  } catch (error) {
    console.warn("⚠️ MongoDB Atlas notice:", error.message);
    console.log("ℹ️ AgroSync AI Server is running safely with offline data fallback.");
  }
};

module.exports = connectDB;