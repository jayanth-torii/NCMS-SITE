const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "ncms-admin-dev-secret";

// Verify the JWT from the Authorization header and attach the payload to req.user.
// Accepts both "Bearer <token>" and a raw token.
const authenticate = (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Only allow admins past this point (used for user-management routes).
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  return next();
};

const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

module.exports = { authenticate, requireAdmin, signToken, JWT_SECRET };
