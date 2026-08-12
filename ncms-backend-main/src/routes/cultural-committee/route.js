const express = require("express");
const router = express.Router();
const CulturalCommitteeController = require("../../controllers/cultural-committee/controller");

// Standard CRUD for the CulturalCommittee page content (singleton)
router.post("/cultural-committee", CulturalCommitteeController.createCulturalCommittee);
router.get("/cultural-committee", CulturalCommitteeController.getCulturalCommittee);
router.put("/cultural-committee", CulturalCommitteeController.updateCulturalCommittee);
router.delete("/cultural-committee", CulturalCommitteeController.deleteCulturalCommittee);

module.exports = router;
