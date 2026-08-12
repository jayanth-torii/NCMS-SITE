const NewsClippings = require("../../models/news-clippings/model");

// GET /api/<route> — return the single NewsClippings doc
exports.getNewsClippings = async (req, res) => {
  try {
    const data = await NewsClippings.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "NewsClippings content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createNewsClippings = async (req, res) => {
  try {
    let data = await NewsClippings.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "NewsClippings content already exists. Use PUT to update." });
    }
    data = new NewsClippings(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateNewsClippings = async (req, res) => {
  try {
    const data = await NewsClippings.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "NewsClippings content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteNewsClippings = async (req, res) => {
  try {
    const data = await NewsClippings.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "NewsClippings content not found." });
    }
    res.status(200).json({ success: true, message: "NewsClippings content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
