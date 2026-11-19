const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load .env explicitly from backend directory
dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");
const cropRoutes = require("./routes/cropRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Connect MongoDB Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/ai", aiRoutes);

// Health check / Base API Route
app.get("/", (req, res) => {
  res.json({
    message: "AgroSync AI Backend is running successfully!",
    status: "Active",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`AgroSync AI Server is running smoothly on http://localhost:${PORT}`);
});