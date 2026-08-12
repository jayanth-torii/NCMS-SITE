const express = require("express");
const router = express.Router();
const NptelLocalChapterController = require("../../controllers/nptel-local-chapter/controller");

// Standard CRUD for the NptelLocalChapter page content (singleton)
router.post("/nptel-local-chapter", NptelLocalChapterController.createNptelLocalChapter);
router.get("/nptel-local-chapter", NptelLocalChapterController.getNptelLocalChapter);
router.put("/nptel-local-chapter", NptelLocalChapterController.updateNptelLocalChapter);
router.delete("/nptel-local-chapter", NptelLocalChapterController.deleteNptelLocalChapter);

module.exports = router;
