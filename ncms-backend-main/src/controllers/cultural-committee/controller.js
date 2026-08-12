const CulturalCommittee = require("../../models/cultural-committee/model");

// GET /api/<route> — return the single CulturalCommittee doc
exports.getCulturalCommittee = async (req, res) => {
  try {
    const data = await CulturalCommittee.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "CulturalCommittee content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createCulturalCommittee = async (req, res) => {
  try {
    let data = await CulturalCommittee.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "CulturalCommittee content already exists. Use PUT to update." });
    }
    data = new CulturalCommittee(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateCulturalCommittee = async (req, res) => {
  try {
    const data = await CulturalCommittee.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "CulturalCommittee content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteCulturalCommittee = async (req, res) => {
  try {
    const data = await CulturalCommittee.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "CulturalCommittee content not found." });
    }
    res.status(200).json({ success: true, message: "CulturalCommittee content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
