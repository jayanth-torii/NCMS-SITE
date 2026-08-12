const Blog = require("../../models/blog/model");

// Create a new Blog post
exports.createBlog = async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    const savedBlog = await newBlog.save();
    res.status(201).json({ success: true, data: savedBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all Blog posts. Public listing returns active only, ordered for display.
exports.getAllBlogs = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const blogs = await Blog.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get a single Blog post by blogId (slug)
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({ blogId: req.params.id });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update an existing Blog post (by blogId)
exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findOneAndUpdate({ blogId: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, data: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete a Blog post (by blogId)
exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findOneAndDelete({ blogId: req.params.id });
    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
