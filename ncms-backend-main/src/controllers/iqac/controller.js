const Iqac = require("../../models/iqac/model");

// GET /api/<route> — return the single Iqac doc
exports.getIqac = async (req, res) => {
  try {
    const data = await Iqac.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "Iqac content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createIqac = async (req, res) => {
  try {
    let data = await Iqac.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "Iqac content already exists. Use PUT to update." });
    }
    data = new Iqac(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateIqac = async (req, res) => {
  try {
    const data = await Iqac.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "Iqac content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteIqac = async (req, res) => {
  try {
    const data = await Iqac.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "Iqac content not found." });
    }
    res.status(200).json({ success: true, message: "Iqac content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
