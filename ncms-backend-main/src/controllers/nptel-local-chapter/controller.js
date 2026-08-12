const NptelLocalChapter = require("../../models/nptel-local-chapter/model");

// GET /api/<route> — return the single NptelLocalChapter doc
exports.getNptelLocalChapter = async (req, res) => {
  try {
    const data = await NptelLocalChapter.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "NptelLocalChapter content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createNptelLocalChapter = async (req, res) => {
  try {
    let data = await NptelLocalChapter.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "NptelLocalChapter content already exists. Use PUT to update." });
    }
    data = new NptelLocalChapter(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateNptelLocalChapter = async (req, res) => {
  try {
    const data = await NptelLocalChapter.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "NptelLocalChapter content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteNptelLocalChapter = async (req, res) => {
  try {
    const data = await NptelLocalChapter.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "NptelLocalChapter content not found." });
    }
    res.status(200).json({ success: true, message: "NptelLocalChapter content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
