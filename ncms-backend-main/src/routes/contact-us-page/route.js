const express = require("express");
const router = express.Router();
const ContactUsPageController = require("../../controllers/contact-us-page/controller");

// Standard CRUD for the ContactUsPage page content (singleton)
router.post("/contact-us-page", ContactUsPageController.createContactUsPage);
router.get("/contact-us-page", ContactUsPageController.getContactUsPage);
router.put("/contact-us-page", ContactUsPageController.updateContactUsPage);
router.delete("/contact-us-page", ContactUsPageController.deleteContactUsPage);

module.exports = router;
