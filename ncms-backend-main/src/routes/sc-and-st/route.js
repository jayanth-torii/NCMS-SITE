const express = require("express");
const router = express.Router();
const ScAndStController = require("../../controllers/sc-and-st/controller");

// Standard CRUD for the ScAndSt page content (singleton)
router.post("/sc-and-st", ScAndStController.createScAndSt);
router.get("/sc-and-st", ScAndStController.getScAndSt);
router.put("/sc-and-st", ScAndStController.updateScAndSt);
router.delete("/sc-and-st", ScAndStController.deleteScAndSt);

module.exports = router;
