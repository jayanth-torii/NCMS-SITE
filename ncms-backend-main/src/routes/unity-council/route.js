const express = require("express");
const router = express.Router();
const UnityCouncilController = require("../../controllers/unity-council/controller");

// Standard CRUD for the UnityCouncil page content (singleton)
router.post("/unity-council", UnityCouncilController.createUnityCouncil);
router.get("/unity-council", UnityCouncilController.getUnityCouncil);
router.put("/unity-council", UnityCouncilController.updateUnityCouncil);
router.delete("/unity-council", UnityCouncilController.deleteUnityCouncil);

module.exports = router;
