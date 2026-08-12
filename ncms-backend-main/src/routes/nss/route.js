const express = require("express");
const router = express.Router();
const NssController = require("../../controllers/nss/controller");

// Standard CRUD for the Nss page content (singleton)
router.post("/nss", NssController.createNss);
router.get("/nss", NssController.getNss);
router.put("/nss", NssController.updateNss);
router.delete("/nss", NssController.deleteNss);

module.exports = router;
