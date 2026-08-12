const express = require("express");
const router = express.Router();
const SyllabusContentsController = require("../../controllers/syllabus-contents/controller");

// Standard CRUD for the SyllabusContents page content (singleton)
router.post("/syllabus-contents", SyllabusContentsController.createSyllabusContents);
router.get("/syllabus-contents", SyllabusContentsController.getSyllabusContents);
router.put("/syllabus-contents", SyllabusContentsController.updateSyllabusContents);
router.delete("/syllabus-contents", SyllabusContentsController.deleteSyllabusContents);

module.exports = router;
