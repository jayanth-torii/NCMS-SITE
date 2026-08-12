const express = require("express");
const router = express.Router();
const NewsClippingsController = require("../../controllers/news-clippings/controller");

// Standard CRUD for the NewsClippings page content (singleton)
router.post("/news-clippings", NewsClippingsController.createNewsClippings);
router.get("/news-clippings", NewsClippingsController.getNewsClippings);
router.put("/news-clippings", NewsClippingsController.updateNewsClippings);
router.delete("/news-clippings", NewsClippingsController.deleteNewsClippings);

module.exports = router;
