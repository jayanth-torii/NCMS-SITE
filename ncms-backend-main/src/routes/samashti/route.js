const express = require("express");
const router = express.Router();
const SamashtiController = require("../../controllers/samashti/controller");

// Standard CRUD for the Samashti page content (singleton)
router.post("/samashti", SamashtiController.createSamashti);
router.get("/samashti", SamashtiController.getSamashti);
router.put("/samashti", SamashtiController.updateSamashti);
router.delete("/samashti", SamashtiController.deleteSamashti);

module.exports = router;
