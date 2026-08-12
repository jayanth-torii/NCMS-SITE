const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const InitiateMongoServer = require("./src/config/db");

// Load env variables
dotenv.config();

// Initialize App
const app = express();

// Connect to Database
InitiateMongoServer();

// Middleware
app.use(
  cors({
    origin: (process.env.FRONTEND_ORIGINS || "http://localhost:3001,http://localhost:3100")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  })
);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// Serve uploaded files (written into the web's public folder; also mirrored
// here so the admin can preview them regardless of which app is serving).
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Disable caching to always force 200 OK responses instead of 304 Not Modified
app.set("etag", false);
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// ---------------------------------------------------------
// Route Imports
// ---------------------------------------------------------
const globalRoutes = require("./src/routes/globalRoutes");

// ---------------------------------------------------------
// Mount Routes
// ---------------------------------------------------------
app.use("/api", globalRoutes);

// Base Route for Health Check
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "NCMS API is up and running!" });
});

// 404 Route Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---------------------------------------------------------
// Start Server
// ---------------------------------------------------------
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`NCMS backend successfully running on PORT ${PORT}`);
});

module.exports = app;
