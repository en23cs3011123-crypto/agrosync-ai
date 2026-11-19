const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "agrosync_jwt_secret_2026";

// Helper: Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "30d" });
};

// Fallback in-memory store if MongoDB Atlas is offline / blocked by network
let fallbackUsers = [];

// @route   POST /api/auth/register
// @desc    Register a new Farmer or Procurement Buyer
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, emailOrPhone, password, role, location, farmOrCompany } = req.body;

    if (!name || !emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide Name, Mobile/Email, and Password.",
      });
    }

    const cleanIdentifier = emailOrPhone.trim().toLowerCase();

    // 1. Try MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ emailOrPhone: cleanIdentifier });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "An account with this Mobile Number or Email already exists.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name: name.trim(),
        emailOrPhone: cleanIdentifier,
        password: hashedPassword,
        role: role || "farmer",
        location: location ? location.trim() : "Madhya Pradesh, India",
        farmOrCompany: farmOrCompany ? farmOrCompany.trim() : "",
      });

      const token = generateToken(newUser._id, newUser.role);

      return res.status(201).json({
        success: true,
        message: "Account created successfully!",
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          emailOrPhone: newUser.emailOrPhone,
          role: newUser.role,
          location: newUser.location,
          farmOrCompany: newUser.farmOrCompany,
        },
      });
    }

    // 2. In-memory fallback
    const existing = fallbackUsers.find((u) => u.emailOrPhone === cleanIdentifier);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An account with this Mobile Number or Email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const mockUser = {
      _id: "user_" + Date.now(),
      name: name.trim(),
      emailOrPhone: cleanIdentifier,
      password: hashedPassword,
      role: role || "farmer",
      location: location ? location.trim() : "Madhya Pradesh, India",
      farmOrCompany: farmOrCompany ? farmOrCompany.trim() : "",
    };
    fallbackUsers.push(mockUser);
    const token = generateToken(mockUser._id, mockUser.role);

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        _id: mockUser._id,
        name: mockUser.name,
        emailOrPhone: mockUser.emailOrPhone,
        role: mockUser.role,
        location: mockUser.location,
        farmOrCompany: mockUser.farmOrCompany,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
      error: error.message,
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your Mobile/Email and Password.",
      });
    }

    const cleanIdentifier = emailOrPhone.trim().toLowerCase();

    // 1. Try MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ emailOrPhone: cleanIdentifier });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "No account found with this Mobile Number or Email. Please register.",
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password. Please try again.",
        });
      }

      const token = generateToken(user._id, user.role);

      return res.status(200).json({
        success: true,
        message: "Login successful!",
        token,
        user: {
          _id: user._id,
          name: user.name,
          emailOrPhone: user.emailOrPhone,
          role: user.role,
          location: user.location,
          farmOrCompany: user.farmOrCompany,
        },
      });
    }

    // 2. In-memory fallback
    const user = fallbackUsers.find((u) => u.emailOrPhone === cleanIdentifier);
    if (!user) {
      // Allow instant demo login if not registered yet
      const demoUser = {
        _id: "demo_user_" + Date.now(),
        name: cleanIdentifier.includes("@") ? "Verified User" : "Rameshwar Patel (Farmer)",
        emailOrPhone: cleanIdentifier,
        role: "farmer",
        location: "Madhya Pradesh, India",
        farmOrCompany: "6 Acres Farm",
      };
      const token = generateToken(demoUser._id, demoUser.role);
      return res.status(200).json({
        success: true,
        message: "Login successful!",
        token,
        user: demoUser,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    const token = generateToken(user._id, user.role);
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        emailOrPhone: user.emailOrPhone,
        role: user.role,
        location: user.location,
        farmOrCompany: user.farmOrCompany,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login.",
      error: error.message,
    });
  }
});

// @route   GET /api/auth/me
// @desc    Verify and get current user info
// @access  Protected
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        return res.status(200).json({
          success: true,
          user,
        });
      }
    }

    const fallback = fallbackUsers.find((u) => u._id === decoded.id);
    return res.status(200).json({
      success: true,
      user: fallback || { _id: decoded.id, name: "Verified Farmer", role: decoded.role },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session token.",
    });
  }
});

module.exports = router;
