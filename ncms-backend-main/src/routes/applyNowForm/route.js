const express = require("express");
const router = express.Router();
const controller = require("../../controllers/applyNowForm/controller");
const { authenticate, requireAdmin } = require("../../middleware/auth");

// Public submission (no auth) — matches the live site's /api/apply-now-forms
router.post("/apply-now-forms", controller.createApplyNowForm);

// Admin inbox
router.get("/apply-now-forms", authenticate, requireAdmin, controller.getApplyNowForms);
router.delete("/apply-now-forms/:id", authenticate, requireAdmin, controller.deleteApplyNowForm);

module.exports = router;
