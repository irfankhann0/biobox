const express = require("express");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const fileRoutes = require("./routes/fileRoutes");
const cors = require("cors");
const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use(cors());
// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Test route
app.get("/", (req, res) => {
  res.send("BioBox Server Running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "This is protected profile data",
    userId: req.user.id,
  });
});
app.use("/api/files", fileRoutes);
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
app.get("/u/:username", (req, res) => {
  res.sendFile(path.join(__dirname, "public/profile.html"));
});