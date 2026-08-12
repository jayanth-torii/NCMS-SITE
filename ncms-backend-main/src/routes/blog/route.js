const express = require("express");
const router = express.Router();
const blogController = require("../../controllers/blog/controller");
const { authenticate, requireAdmin } = require("../../middleware/auth");

// Full sub-paths declared here; mounted at root in globalRoutes.js
//   /api/blogs, /api/blogs/:id

// Create a new blog post
router.post("/blogs", authenticate, requireAdmin, blogController.createBlog);

// Get all blog posts (active only; ?all=true for admin)
router.get("/blogs", blogController.getAllBlogs);

// Get a single blog post by blogId (slug)
router.get("/blogs/:id", blogController.getBlogById);

// Update a blog post by blogId
router.put("/blogs/:id", authenticate, requireAdmin, blogController.updateBlog);

// Delete a blog post by blogId
router.delete("/blogs/:id", authenticate, requireAdmin, blogController.deleteBlog);

module.exports = router;
