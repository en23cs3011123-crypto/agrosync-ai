const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Crop = require("../models/Crop");

// Memory fallback store if MongoDB Atlas is temporarily unreachable (e.g. offline college Wi-Fi)
let fallbackCrops = [
  {
    _id: "crop_1",
    name: "Wheat (Sharbati)",
    quantity: 50,
    price: 2850,
    farmerName: "Rameshwar Patel",
    farmerContact: "9876543210",
    location: "Indore, MP",
    status: "Available",
    createdAt: new Date(),
  },
  {
    _id: "crop_2",
    name: "Soybean (JS-335)",
    quantity: 35,
    price: 4800,
    farmerName: "Rameshwar Patel",
    farmerContact: "9876543210",
    location: "Ujjain, MP",
    status: "Available",
    createdAt: new Date(),
  },
  {
    _id: "crop_3",
    name: "Mustard",
    quantity: 20,
    price: 5650,
    farmerName: "Suresh Meena",
    farmerContact: "9876543210",
    location: "Kota, Rajasthan",
    status: "Available",
    createdAt: new Date(),
  },
];

// GET /api/crops - Get all crops
router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const crops = await Crop.find().sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: crops.length,
        data: crops,
      });
    }
  } catch (error) {
    console.warn("MongoDB fetch note, using active fallback crops:", error.message);
  }

  // Fallback return
  return res.json({
    success: true,
    count: fallbackCrops.length,
    data: fallbackCrops,
  });
});

// POST /api/crops - Add a new crop
router.post("/", async (req, res) => {
  try {
    const { name, quantity, price, farmerName, farmerContact, location } = req.body;

    if (!name || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: "Crop name, quantity, and price are required",
      });
    }

    if (mongoose.connection.readyState === 1) {
      const crop = await Crop.create({
        name,
        quantity: Number(quantity),
        price: Number(price),
        farmerName: farmerName || "Rameshwar Patel",
        farmerContact: farmerContact || "9876543210",
        location: location || "Madhya Pradesh, India",
      });

      return res.status(201).json({
        success: true,
        message: "Crop listed successfully",
        data: crop,
      });
    }

    // In-memory fallback
    const newCrop = {
      _id: "crop_" + Date.now(),
      name,
      quantity: Number(quantity),
      price: Number(price),
      farmerName: farmerName || "Rameshwar Patel",
      farmerContact: farmerContact || "9876543210",
      location: location || "Madhya Pradesh, India",
      status: "Available",
      createdAt: new Date(),
    };
    fallbackCrops.unshift(newCrop);

    return res.status(201).json({
      success: true,
      message: "Crop listed successfully",
      data: newCrop,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create crop listing",
      error: error.message,
    });
  }
});

// DELETE /api/crops/:id - Remove a crop
router.delete("/:id", async (req, res) => {
  try {
    const targetId = req.params.id;
    if (mongoose.connection.readyState === 1) {
      try {
        const crop = await Crop.findByIdAndDelete(targetId);
        if (crop) {
          return res.json({
            success: true,
            message: "Crop deleted successfully",
            data: crop,
          });
        }
      } catch (e) {
        // Fall through to fallback
      }
    }

    fallbackCrops = fallbackCrops.filter((c) => c._id !== targetId && c.id !== targetId);
    return res.json({
      success: true,
      message: "Crop deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete crop",
      error: error.message,
    });
  }
});

module.exports = router;
