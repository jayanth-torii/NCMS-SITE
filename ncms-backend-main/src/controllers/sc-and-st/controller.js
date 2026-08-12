const ScAndSt = require("../../models/sc-and-st/model");

// GET /api/<route> — return the single ScAndSt doc
exports.getScAndSt = async (req, res) => {
  try {
    const data = await ScAndSt.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "ScAndSt content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createScAndSt = async (req, res) => {
  try {
    let data = await ScAndSt.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "ScAndSt content already exists. Use PUT to update." });
    }
    data = new ScAndSt(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateScAndSt = async (req, res) => {
  try {
    const data = await ScAndSt.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "ScAndSt content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteScAndSt = async (req, res) => {
  try {
    const data = await ScAndSt.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "ScAndSt content not found." });
    }
    res.status(200).json({ success: true, message: "ScAndSt content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
