const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

// Use the URL provided in the environment
const MONGOURI = process.env.MONGO_URI;

// Ensure a default admin exists (idempotent: only creates if missing).
const ensureDefaultAdmin = async () => {
  try {
    const UserModel = require("../models/auth/model");
    const email = process.env.ADMIN_EMAIL || "admin@ncms.co.in";
    const existing = await UserModel.findOne({ email });
    if (existing) return;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", salt);
    await UserModel.create({
      name: "Admin",
      username: "admin",
      email,
      password: hashedPassword,
      role: "admin",
      department: "",
      permissions: [],
      added_by: "system",
    });
    console.log(`Default admin created: ${email}`);
  } catch (e) {
    console.error("Failed to ensure default admin:", e.message);
  }
};

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB !!");
    await ensureDefaultAdmin();
  } catch (e) {
    console.error("Failed to connect to MongoDB:", e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
