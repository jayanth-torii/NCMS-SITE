const express = require("express");
const router = express.Router();
const AntiSexualHarassmentController = require("../../controllers/anti-sexual-harassment/controller");

// Standard CRUD for the AntiSexualHarassment page content (singleton)
router.post("/anti-sexual-harassment", AntiSexualHarassmentController.createAntiSexualHarassment);
router.get("/anti-sexual-harassment", AntiSexualHarassmentController.getAntiSexualHarassment);
router.put("/anti-sexual-harassment", AntiSexualHarassmentController.updateAntiSexualHarassment);
router.delete("/anti-sexual-harassment", AntiSexualHarassmentController.deleteAntiSexualHarassment);

module.exports = router;
