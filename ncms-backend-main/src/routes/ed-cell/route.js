const express = require("express");
const router = express.Router();
const EdCellController = require("../../controllers/ed-cell/controller");

// Standard CRUD for the EdCell page content (singleton)
router.post("/ed-cell", EdCellController.createEdCell);
router.get("/ed-cell", EdCellController.getEdCell);
router.put("/ed-cell", EdCellController.updateEdCell);
router.delete("/ed-cell", EdCellController.deleteEdCell);

module.exports = router;
