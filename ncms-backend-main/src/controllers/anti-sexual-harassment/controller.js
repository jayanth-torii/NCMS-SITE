const AntiSexualHarassment = require("../../models/anti-sexual-harassment/model");

// GET /api/<route> — return the single AntiSexualHarassment doc
exports.getAntiSexualHarassment = async (req, res) => {
  try {
    const data = await AntiSexualHarassment.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "AntiSexualHarassment content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createAntiSexualHarassment = async (req, res) => {
  try {
    let data = await AntiSexualHarassment.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "AntiSexualHarassment content already exists. Use PUT to update." });
    }
    data = new AntiSexualHarassment(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateAntiSexualHarassment = async (req, res) => {
  try {
    const data = await AntiSexualHarassment.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "AntiSexualHarassment content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteAntiSexualHarassment = async (req, res) => {
  try {
    const data = await AntiSexualHarassment.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "AntiSexualHarassment content not found." });
    }
    res.status(200).json({ success: true, message: "AntiSexualHarassment content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
