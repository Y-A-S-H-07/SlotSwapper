const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const swapRoutes = require("./routes/swapRoutes");

dotenv.config();

// connect database
connectDB();

const app = express();

// ----------------------
// CORS configuration
// ----------------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// middleware
app.use(express.json());

// ----------------------
// Test route
// ----------------------
app.get("/", (req, res) => {
  res.send("SlotSwapper API is running...");
});

// ----------------------
// API routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/swaps", swapRoutes);

// ----------------------
// Server start
// ----------------------
const PORT = process.env.PORT || 5001; // use 5001 instead of 5000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
