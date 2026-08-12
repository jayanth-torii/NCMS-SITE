const express = require("express");
const router = express.Router();
const VisionMissionsController = require("../../controllers/vision-missions/controller");

// Standard CRUD for the VisionMissions page content (singleton)
router.post("/vision-missions", VisionMissionsController.createVisionMissions);
router.get("/vision-missions", VisionMissionsController.getVisionMissions);
router.put("/vision-missions", VisionMissionsController.updateVisionMissions);
router.delete("/vision-missions", VisionMissionsController.deleteVisionMissions);

module.exports = router;
