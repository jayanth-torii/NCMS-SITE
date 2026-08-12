const User = require("../../models/auth/model");
const bcrypt = require("bcrypt");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a user
exports.createUser = async (req, res) => {
  try {
    const { email, password, name, role, department, permissions } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password || "welcome123", salt);
    const user = await User.create({
      name,
      username: name,
      email,
      password: hashed,
      role: role || "faculty",
      department: department || "",
      permissions: permissions || [],
    });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const updates = { ...rest };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
