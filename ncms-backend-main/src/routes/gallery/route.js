const express = require("express");
const router = express.Router();
const GalleryController = require("../../controllers/gallery/controller");

// Standard CRUD for the Gallery page content (singleton)
router.post("/gallery", GalleryController.createGallery);
router.get("/gallery", GalleryController.getGallery);
router.put("/gallery", GalleryController.updateGallery);
router.delete("/gallery", GalleryController.deleteGallery);

module.exports = router;
