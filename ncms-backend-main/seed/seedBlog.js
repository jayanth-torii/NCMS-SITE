const fs = require("fs");
const path = require("path");
const { DATA_EXPORT_ROOT } = require("./dataExportPath");

async function seedBlog() {
  const Blog = require("mongoose").model("Blog");
  const file = path.join(DATA_EXPORT_ROOT, "blog", "data.json");
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  const blogs = json.blogObject || [];

  let count = 0;
  for (const item of blogs) {
    const blogId = String(item.id);
    await Blog.findOneAndUpdate(
      { blogId },
      {
        blogId,
        title: item.title || "",
        description: item.description || "",
        category: item.category || "",
        author: item.author || "",
        date: item.date || "",
        image: item.blogImage || item.image || "",
        readTime: item.readTime || "",
        excerpt: item.description || "",
        content: item.content || [],
        order: Number(item.order ?? item.id ?? count),
        isActive: item.isActive !== false,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    count++;
  }
  console.log(`Seeded ${count} blog posts.`);
}

module.exports = { seedBlog };
