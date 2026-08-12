const express = require("express");
const router = express.Router();
const ResearchCellController = require("../../controllers/research-cell/controller");

// Standard CRUD for the ResearchCell page content (singleton)
router.post("/research-cell", ResearchCellController.createResearchCell);
router.get("/research-cell", ResearchCellController.getResearchCell);
router.put("/research-cell", ResearchCellController.updateResearchCell);
router.delete("/research-cell", ResearchCellController.deleteResearchCell);

module.exports = router;
