const express = require("express");
const router = express.Router();
const IqacController = require("../../controllers/iqac/controller");

// Standard CRUD for the Iqac page content (singleton)
router.post("/iqac", IqacController.createIqac);
router.get("/iqac", IqacController.getIqac);
router.put("/iqac", IqacController.updateIqac);
router.delete("/iqac", IqacController.deleteIqac);

module.exports = router;
