const SakhiSamrudhi = require("../../models/sakhi-samrudhi/model");

// GET /api/<route> — return the single SakhiSamrudhi doc
exports.getSakhiSamrudhi = async (req, res) => {
  try {
    const data = await SakhiSamrudhi.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "SakhiSamrudhi content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createSakhiSamrudhi = async (req, res) => {
  try {
    let data = await SakhiSamrudhi.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "SakhiSamrudhi content already exists. Use PUT to update." });
    }
    data = new SakhiSamrudhi(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateSakhiSamrudhi = async (req, res) => {
  try {
    const data = await SakhiSamrudhi.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "SakhiSamrudhi content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteSakhiSamrudhi = async (req, res) => {
  try {
    const data = await SakhiSamrudhi.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "SakhiSamrudhi content not found." });
    }
    res.status(200).json({ success: true, message: "SakhiSamrudhi content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
