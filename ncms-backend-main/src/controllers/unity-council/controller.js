const UnityCouncil = require("../../models/unity-council/model");

// GET /api/<route> — return the single UnityCouncil doc
exports.getUnityCouncil = async (req, res) => {
  try {
    const data = await UnityCouncil.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "UnityCouncil content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createUnityCouncil = async (req, res) => {
  try {
    let data = await UnityCouncil.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "UnityCouncil content already exists. Use PUT to update." });
    }
    data = new UnityCouncil(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateUnityCouncil = async (req, res) => {
  try {
    const data = await UnityCouncil.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "UnityCouncil content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteUnityCouncil = async (req, res) => {
  try {
    const data = await UnityCouncil.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "UnityCouncil content not found." });
    }
    res.status(200).json({ success: true, message: "UnityCouncil content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
