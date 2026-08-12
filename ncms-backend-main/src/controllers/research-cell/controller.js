const ResearchCell = require("../../models/research-cell/model");

// GET /api/<route> — return the single ResearchCell doc
exports.getResearchCell = async (req, res) => {
  try {
    const data = await ResearchCell.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "ResearchCell content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createResearchCell = async (req, res) => {
  try {
    let data = await ResearchCell.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "ResearchCell content already exists. Use PUT to update." });
    }
    data = new ResearchCell(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateResearchCell = async (req, res) => {
  try {
    const data = await ResearchCell.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "ResearchCell content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteResearchCell = async (req, res) => {
  try {
    const data = await ResearchCell.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "ResearchCell content not found." });
    }
    res.status(200).json({ success: true, message: "ResearchCell content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
