const express = require("express");
const router = express.Router();
const AntiRaggingController = require("../../controllers/anti-ragging/controller");

// Standard CRUD for the AntiRagging page content (singleton)
router.post("/anti-ragging", AntiRaggingController.createAntiRagging);
router.get("/anti-ragging", AntiRaggingController.getAntiRagging);
router.put("/anti-ragging", AntiRaggingController.updateAntiRagging);
router.delete("/anti-ragging", AntiRaggingController.deleteAntiRagging);

module.exports = router;
