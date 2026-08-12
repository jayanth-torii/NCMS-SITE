const express = require("express");
const router = express.Router();
const LibraryController = require("../../controllers/library/controller");

// Standard CRUD for the Library page content (singleton)
router.post("/library", LibraryController.createLibrary);
router.get("/library", LibraryController.getLibrary);
router.put("/library", LibraryController.updateLibrary);
router.delete("/library", LibraryController.deleteLibrary);

module.exports = router;
