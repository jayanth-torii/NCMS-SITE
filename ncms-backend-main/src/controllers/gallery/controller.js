const Gallery = require("../../models/gallery/model");

// GET /api/<route> — return the single Gallery doc
exports.getGallery = async (req, res) => {
  try {
    const data = await Gallery.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "Gallery content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createGallery = async (req, res) => {
  try {
    let data = await Gallery.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "Gallery content already exists. Use PUT to update." });
    }
    data = new Gallery(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateGallery = async (req, res) => {
  try {
    const data = await Gallery.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "Gallery content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteGallery = async (req, res) => {
  try {
    const data = await Gallery.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "Gallery content not found." });
    }
    res.status(200).json({ success: true, message: "Gallery content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
