const express = require("express");
const router = express.Router();
const NewsLetterController = require("../../controllers/news-letter/controller");

// Standard CRUD for the NewsLetter page content (singleton)
router.post("/news-letter", NewsLetterController.createNewsLetter);
router.get("/news-letter", NewsLetterController.getNewsLetter);
router.put("/news-letter", NewsLetterController.updateNewsLetter);
router.delete("/news-letter", NewsLetterController.deleteNewsLetter);

module.exports = router;
