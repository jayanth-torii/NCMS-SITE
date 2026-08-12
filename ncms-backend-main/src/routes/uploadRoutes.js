const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const { authenticate, requireAdmin } = require("../middleware/auth");

// Endpoint to handle the upload (admin only). Files are stored locally under
// the web's public/uploads (see src/utils/upload.js) and served by the site
// directly; S3 will replace this storage later.
router.post("/", authenticate, requireAdmin, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // req.file.path is the absolute local path; expose a root-relative URL
    // (e.g. /uploads/<timestamp>-<name>) that the site and admin can load.
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: fileUrl,
        key: req.file.filename,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (err) {
    console.error("Error during file upload:", err);
    res.status(500).json({ success: false, message: "Server error during upload" });
  }
});

module.exports = router;
