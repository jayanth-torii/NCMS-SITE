const multer = require("multer");
const fs = require("fs");
const path = require("path");

// All admin uploads are stored LOCALLY (S3 comes later), under the web's
// public/ folder so the public site serves them directly, e.g.
//   <WEB_PUBLIC_DIR>/uploads/<timestamp>-<name>
// The backend also mirrors them at /uploads (app.js static mount).
const WEB_PUBLIC_DIR = path.resolve(
  __dirname,
  "..",
  "..",
  process.env.WEB_PUBLIC_DIR || "../ncms-web-main/public"
);
const UPLOADS_SUB_DIR = process.env.UPLOADS_SUB_DIR || "uploads";
const UPLOADS_DIR = path.join(WEB_PUBLIC_DIR, UPLOADS_SUB_DIR);

// Ensure the uploads dir exists (both web-side and backend-side mirror).
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
fs.mkdirSync(path.join(__dirname, "..", "..", "public", "uploads"), { recursive: true });

// Sanitize the original filename for a clean, URL-safe stored name.
const safeName = (name = "file") =>
  name.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${safeName(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed"));
    }
  },
});

module.exports = upload;
