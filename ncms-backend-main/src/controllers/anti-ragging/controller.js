const AntiRagging = require("../../models/anti-ragging/model");

// GET /api/<route> — return the single AntiRagging doc
exports.getAntiRagging = async (req, res) => {
  try {
    const data = await AntiRagging.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "AntiRagging content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createAntiRagging = async (req, res) => {
  try {
    let data = await AntiRagging.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "AntiRagging content already exists. Use PUT to update." });
    }
    data = new AntiRagging(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateAntiRagging = async (req, res) => {
  try {
    const data = await AntiRagging.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "AntiRagging content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteAntiRagging = async (req, res) => {
  try {
    const data = await AntiRagging.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "AntiRagging content not found." });
    }
    res.status(200).json({ success: true, message: "AntiRagging content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
