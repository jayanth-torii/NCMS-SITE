const express = require("express");
const router = express.Router();
const FooterController = require("../../controllers/footer/controller");

// Standard CRUD for the Footer page content (singleton)
router.post("/footer", FooterController.createFooter);
router.get("/footer", FooterController.getFooter);
router.put("/footer", FooterController.updateFooter);
router.delete("/footer", FooterController.deleteFooter);

module.exports = router;
