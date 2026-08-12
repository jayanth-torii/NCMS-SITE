const express = require("express");
const router = express.Router();
const UucmsController = require("../../controllers/uucms/controller");

// Standard CRUD for the Uucms page content (singleton)
router.post("/uucms", UucmsController.createUucms);
router.get("/uucms", UucmsController.getUucms);
router.put("/uucms", UucmsController.updateUucms);
router.delete("/uucms", UucmsController.deleteUucms);

module.exports = router;
