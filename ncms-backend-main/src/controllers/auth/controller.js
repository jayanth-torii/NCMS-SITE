const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../../models/auth/model");
const { signToken, JWT_SECRET } = require("../../middleware/auth");

// Default/master OTP — always accepted (mirrors NCET) so sign-in works even if
// the OTP email doesn't arrive.
const DEFAULT_OTP = "000000";
const OTP_TTL_MS = 10 * 60 * 1000;

const genOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// Build the full user object the admin UI needs to gate access.
const publicUser = (user) => ({
  id: user._id,
  Department: user.Department,
  department: user.department || "",
  name: user.name,
  username: user.username || user.name,
  role: user.role,
  email: user.email,
  permissions: user.permissions || [],
});

// STEP 1 of login: validate email + password, then require an email OTP.
const login_user = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const preAuthToken = jwt.sign({ id: user._id, stage: "otp" }, JWT_SECRET, { expiresIn: "10m" });

      const otp = genOtp();
      user.otp = otp;
      user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
      await user.save();

      return res.status(200).json({
        message: "OTP required",
        otpRequired: true,
        preAuthToken,
        otp, // client emails this via EmailJS; verified server-side in step 2
        user: { name: user.name, email: user.email },
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// STEP 2 of login: verify the OTP (or accept the master 000000), then mint the
// real session token + return the full user profile.
const verify_login = async (req, res) => {
  const { preAuthToken, otp } = req.body;

  if (!preAuthToken) {
    return res.status(400).json({ message: "Missing verification token" });
  }

  let payload;
  try {
    payload = jwt.verify(preAuthToken, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired verification token" });
  }

  const user = await UserModel.findById(payload.id);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const otpMatches =
    otp === DEFAULT_OTP ||
    (user.otp && String(user.otp) === String(otp) && user.otpExpiresAt && new Date(user.otpExpiresAt) > new Date());

  if (!otpMatches) {
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }

  // Clear the OTP once used
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  const token = signToken({ id: user._id, email: user.email, role: user.role });
  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: publicUser(user),
  });
};

// Get the current user from the token.
const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user: publicUser(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const register_user = async (req, res) => {
  const { name, username, email, password, role, department } = req.body;
  try {
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await UserModel.create({
      name,
      username,
      email,
      password: hashed,
      role: role || "faculty",
      department: department || "",
    });
    return res.status(201).json({ success: true, user: publicUser(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  login_user,
  verify_login,
  getMe,
  updatePassword,
  register_user,
};
