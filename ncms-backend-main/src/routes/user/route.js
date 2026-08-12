const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/controller");
const { authenticate, requireAdmin } = require("../../middleware/auth");

// User management (admin-only)
router.get("/users", authenticate, requireAdmin, userController.getUsers);
router.get("/users/:id", authenticate, requireAdmin, userController.getUserById);
router.post("/users", authenticate, requireAdmin, userController.createUser);
router.put("/users/:id", authenticate, requireAdmin, userController.updateUser);
router.delete("/users/:id", authenticate, requireAdmin, userController.deleteUser);

module.exports = router;
