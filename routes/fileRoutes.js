const express = require("express");
const multer = require("multer");
const path = require("path");
const File = require("../models/File");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
  cb(null, file.originalname);
},
});

const upload = multer({ storage });

// Upload route
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const newFile = new File({
      user: req.user.id,
      filename: req.file.filename,
      filepath: req.file.path,
    });

    await newFile.save();

    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
// Get all files of logged-in user
router.get("/my-files", authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id });

    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch files" });
  }
});
// Public profile route
router.get("/user/:username", async (req, res) => {
  try {

    const User = require("../models/User");

    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const files = await File.find({ user: user._id });

    res.json({
 username: user.username,
 bio: user.bio,
 profileImage: user.profileImage,
 files: files
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error loading profile" });
  }
});
// Delete file
const fs = require("fs");

// Delete file
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete file from uploads folder
    fs.unlink(file.filepath, (err) => {
      if (err) {
        console.log("File delete error:", err);
      }
    });

    // Delete from database
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: "File deleted completely" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
});