const mongoose = require("mongoose");

/**
 * Blog — one document per blog post / article.
 * `blogId` is the slug used in the URL (/blog/:blogId).
 */
const BlogSchema = new mongoose.Schema(
  {
    blogId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    date: { type: String },
    category: { type: String },
    author: { type: String },
    image: { type: String },
    readTime: { type: String },
    excerpt: { type: String },
    content: { type: mongoose.Schema.Types.Mixed, default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
