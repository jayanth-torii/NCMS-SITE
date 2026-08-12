const express = require("express");
const router = express.Router();
const HodContentsController = require("../../controllers/hod-contents/controller");

// Standard CRUD for the HodContents page content (singleton)
router.post("/hod-contents", HodContentsController.createHodContents);
router.get("/hod-contents", HodContentsController.getHodContents);
router.put("/hod-contents", HodContentsController.updateHodContents);
router.delete("/hod-contents", HodContentsController.deleteHodContents);

module.exports = router;
