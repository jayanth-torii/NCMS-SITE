const express = require("express");
const router = express.Router();
const ApplyNowController = require("../../controllers/apply-now/controller");

// Standard CRUD for the ApplyNow page content (singleton)
router.post("/apply-now", ApplyNowController.createApplyNow);
router.get("/apply-now", ApplyNowController.getApplyNow);
router.put("/apply-now", ApplyNowController.updateApplyNow);
router.delete("/apply-now", ApplyNowController.deleteApplyNow);

module.exports = router;
