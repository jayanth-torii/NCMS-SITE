const express = require("express");
const router = express.Router();
const HumanRightsController = require("../../controllers/human-rights/controller");

// Standard CRUD for the HumanRights page content (singleton)
router.post("/human-rights", HumanRightsController.createHumanRights);
router.get("/human-rights", HumanRightsController.getHumanRights);
router.put("/human-rights", HumanRightsController.updateHumanRights);
router.delete("/human-rights", HumanRightsController.deleteHumanRights);

module.exports = router;
