require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("../config/db");
const authRoutes = require("../routes/auth");
const authMiddleware = require("../middleware/authMiddleware");
const fileRoutes = require("../routes/fileRoutes");
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


app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "This is protected profile data",
    userId: req.user.id,
  });
});
app.use("/api/files", fileRoutes);
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static("/tmp/uploads"));
app.get("/u/:username", (req, res) => {
  res.sendFile(path.join(__dirname, "public/profile.html"));
});
if (process.env.NODE_ENV !== "production") {
const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
}
module.exports = app;