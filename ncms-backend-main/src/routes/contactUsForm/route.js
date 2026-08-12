const express = require("express");
const router = express.Router();
const controller = require("../../controllers/contactUsForm/controller");
const { authenticate, requireAdmin } = require("../../middleware/auth");

// Public submission (no auth) — matches the live site's /api/contact-us-forms
router.post("/contact-us-forms", controller.createContactUsForm);

// Admin inbox
router.get("/contact-us-forms", authenticate, requireAdmin, controller.getContactUsForms);
router.delete("/contact-us-forms/:id", authenticate, requireAdmin, controller.deleteContactUsForm);

module.exports = router;
