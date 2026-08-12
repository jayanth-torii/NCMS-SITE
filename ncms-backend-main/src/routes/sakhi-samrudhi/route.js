const express = require("express");
const router = express.Router();
const SakhiSamrudhiController = require("../../controllers/sakhi-samrudhi/controller");

// Standard CRUD for the SakhiSamrudhi page content (singleton)
router.post("/sakhi-samrudhi", SakhiSamrudhiController.createSakhiSamrudhi);
router.get("/sakhi-samrudhi", SakhiSamrudhiController.getSakhiSamrudhi);
router.put("/sakhi-samrudhi", SakhiSamrudhiController.updateSakhiSamrudhi);
router.delete("/sakhi-samrudhi", SakhiSamrudhiController.deleteSakhiSamrudhi);

module.exports = router;
