const SyllabusContents = require("../../models/syllabus-contents/model");

// GET /api/<route> — return the single SyllabusContents doc
exports.getSyllabusContents = async (req, res) => {
  try {
    const data = await SyllabusContents.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "SyllabusContents content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createSyllabusContents = async (req, res) => {
  try {
    let data = await SyllabusContents.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "SyllabusContents content already exists. Use PUT to update." });
    }
    data = new SyllabusContents(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateSyllabusContents = async (req, res) => {
  try {
    const data = await SyllabusContents.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "SyllabusContents content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteSyllabusContents = async (req, res) => {
  try {
    const data = await SyllabusContents.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "SyllabusContents content not found." });
    }
    res.status(200).json({ success: true, message: "SyllabusContents content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
