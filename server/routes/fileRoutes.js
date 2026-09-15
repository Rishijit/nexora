const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const File = require("../models/File");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Make sure the uploads folder exists
const uploadsDirectory = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

// Configure how uploaded files are stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDirectory);
  },

  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

// Limit file size to 10 MB
const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// All file routes require login
router.use(protect);

// Upload a file
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a file to upload",
      });
    }

    const savedFile = await File.create({
      originalName: req.file.originalname,
      storedName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      user: req.userId,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: savedFile,
    });
  } catch (error) {
    console.error("Upload file error:", error);

    // Remove uploaded file if database saving fails
    if (req.file) {
      fs.unlink(req.file.path, (unlinkError) => {
        if (unlinkError) {
          console.error("Failed to remove uploaded file:", unlinkError);
        }
      });
    }

    res.status(500).json({
      message: "Failed to upload file",
    });
  }
});

// Get only the logged-in user's files
router.get("/", async (req, res) => {
  try {
    const files = await File.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(files);
  } catch (error) {
    console.error("Fetch files error:", error);

    res.status(500).json({
      message: "Failed to fetch files",
    });
  }
});

// Download a file owned by the logged-in user
router.get("/:id/download", async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!file) {
      return res.status(404).json({
        message: "File not found or access denied",
      });
    }

    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({
        message: "Stored file no longer exists",
      });
    }

    res.download(file.filePath, file.originalName);
  } catch (error) {
    console.error("Download file error:", error);

    res.status(500).json({
      message: "Failed to download file",
    });
  }
});

// Delete a file owned by the logged-in user
router.delete("/:id", async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!file) {
      return res.status(404).json({
        message: "File not found or access denied",
      });
    }

    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    await File.findByIdAndDelete(file._id);

    res.json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete file error:", error);

    res.status(500).json({
      message: "Failed to delete file",
    });
  }
});

module.exports = router;