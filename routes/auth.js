const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
const existingEmail = await User.findOne({ email });
if (existingEmail) {
  return res.status(400).json({ message: "Email already exists" });
}

// Check if username already exists
const existingUsername = await User.findOne({ username });
if (existingUsername) {
  return res.status(400).json({ message: "Username already exists" });
}
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
const jwt = require("jsonwebtoken");

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
const authMiddleware = require("../middleware/authMiddleware");

// Update Bio
router.post("/update-bio", authMiddleware, async (req, res) => {
  try {

    const { bio } = req.body;

    const User = require("../models/User");

    await User.findByIdAndUpdate(
      req.user.id,
      { bio: bio }
    );

    res.json({ message: "Bio updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
});
const multer = require("multer");
const path = require("path");

// Profile image storage
const imageStorage = multer.diskStorage({

 destination: function(req, file, cb) {
   cb(null, "uploads/");
 },

 filename: function(req, file, cb) {
   cb(null, "profile_" + Date.now() + path.extname(file.originalname));
 }

});

const uploadImage = multer({ storage: imageStorage });

// Upload profile image
router.post("/upload-image",
authMiddleware,
uploadImage.single("image"),
async (req, res) => {

 try {

   const User = require("../models/User");

   await User.findByIdAndUpdate(
     req.user.id,
     { profileImage: req.file.path }
   );

   res.json({ message: "Profile image uploaded" });

 } catch(error){

   console.log(error);
   res.status(500).json({ message: "Upload failed" });

 }

});