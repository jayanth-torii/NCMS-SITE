const express = require("express");
const router = express.Router();
const PlacementController = require("../../controllers/placement/controller");

// Standard CRUD for the Placement page content (singleton)
router.post("/placement", PlacementController.createPlacement);
router.get("/placement", PlacementController.getPlacement);
router.put("/placement", PlacementController.updatePlacement);
router.delete("/placement", PlacementController.deletePlacement);

module.exports = router;
