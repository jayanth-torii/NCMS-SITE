const express = require("express");
const router = express.Router();
const HomeController = require("../../controllers/home/controller");

// Standard CRUD for the Home page content (singleton)
router.post("/home", HomeController.createHome);
router.get("/home", HomeController.getHome);
router.put("/home", HomeController.updateHome);
router.delete("/home", HomeController.deleteHome);

module.exports = router;
