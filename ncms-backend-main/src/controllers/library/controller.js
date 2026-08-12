const Library = require("../../models/library/model");

// GET /api/<route> — return the single Library doc
exports.getLibrary = async (req, res) => {
  try {
    const data = await Library.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "Library content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createLibrary = async (req, res) => {
  try {
    let data = await Library.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "Library content already exists. Use PUT to update." });
    }
    data = new Library(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateLibrary = async (req, res) => {
  try {
    const data = await Library.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "Library content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteLibrary = async (req, res) => {
  try {
    const data = await Library.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "Library content not found." });
    }
    res.status(200).json({ success: true, message: "Library content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
