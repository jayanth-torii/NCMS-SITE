// One-time script: node seed/seedAdmin.js
require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { loadAllModels } = require("./loadModels");

async function run() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before running this script");
  }

  await mongoose.connect(MONGO_URI);
  loadAllModels();
  const User = mongoose.model("User");

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`Admin ${ADMIN_EMAIL} already exists, skipping.`);
  } else {
    const password = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({ name: "Admin", username: "admin", email: ADMIN_EMAIL, password, role: "admin" });
    console.log(`Created admin account: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
