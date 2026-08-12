const express = require("express");
const router = express.Router();
const BlogBannerController = require("../../controllers/blog-banner/controller");

// Standard CRUD for the BlogBanner page content (singleton)
router.post("/blog-banner", BlogBannerController.createBlogBanner);
router.get("/blog-banner", BlogBannerController.getBlogBanner);
router.put("/blog-banner", BlogBannerController.updateBlogBanner);
router.delete("/blog-banner", BlogBannerController.deleteBlogBanner);

module.exports = router;
