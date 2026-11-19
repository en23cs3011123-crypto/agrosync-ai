const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    emailOrPhone: {
      type: String,
      required: [true, "Mobile number or Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["farmer", "buyer"],
      default: "farmer",
    },
    location: {
      type: String,
      default: "Madhya Pradesh, India",
      trim: true,
    },
    farmOrCompany: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Compare password helper method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
