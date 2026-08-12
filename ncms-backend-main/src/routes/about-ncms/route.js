const express = require("express");
const router = express.Router();
const AboutNcmsController = require("../../controllers/about-ncms/controller");

// Standard CRUD for the AboutNcms page content (singleton)
router.post("/about-ncms", AboutNcmsController.createAboutNcms);
router.get("/about-ncms", AboutNcmsController.getAboutNcms);
router.put("/about-ncms", AboutNcmsController.updateAboutNcms);
router.delete("/about-ncms", AboutNcmsController.deleteAboutNcms);

module.exports = router;
