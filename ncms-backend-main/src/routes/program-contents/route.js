const express = require("express");
const router = express.Router();
const ProgramContentsController = require("../../controllers/program-contents/controller");

// Standard CRUD for the ProgramContents page content (singleton)
router.post("/program-contents", ProgramContentsController.createProgramContents);
router.get("/program-contents", ProgramContentsController.getProgramContents);
router.put("/program-contents", ProgramContentsController.updateProgramContents);
router.delete("/program-contents", ProgramContentsController.deleteProgramContents);

module.exports = router;
