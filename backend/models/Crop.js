const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Crop name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1 Quintal"],
    },
    price: {
      type: Number,
      required: [true, "Price per quintal is required"],
      min: [1, "Price must be greater than 0"],
    },
    farmerName: {
      type: String,
      default: "Rameshwar Patel",
    },
    farmerContact: {
      type: String,
      default: "9876543210",
    },
    location: {
      type: String,
      default: "Madhya Pradesh, India",
    },
    status: {
      type: String,
      enum: ["Available", "Under Negotiation", "Procured"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Crop", cropSchema);
