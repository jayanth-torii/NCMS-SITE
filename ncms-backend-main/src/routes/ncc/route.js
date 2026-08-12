const express = require("express");
const router = express.Router();
const NccController = require("../../controllers/ncc/controller");

// Standard CRUD for the Ncc page content (singleton)
router.post("/ncc", NccController.createNcc);
router.get("/ncc", NccController.getNcc);
router.put("/ncc", NccController.updateNcc);
router.delete("/ncc", NccController.deleteNcc);

module.exports = router;
