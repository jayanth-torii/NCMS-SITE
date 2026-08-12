const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/controller");
const { authenticate } = require("../../middleware/auth");

// Mount Authentication routes
router.post("/login-user", authController.login_user);
router.post("/login-verify", authController.verify_login);
router.post("/register", authController.register_user);
router.post("/update-password", authenticate, authController.updatePassword);
router.get("/me", authenticate, authController.getMe);

module.exports = router;
