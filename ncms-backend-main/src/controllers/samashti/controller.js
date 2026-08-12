const Samashti = require("../../models/samashti/model");

// GET /api/<route> — return the single Samashti doc
exports.getSamashti = async (req, res) => {
  try {
    const data = await Samashti.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "Samashti content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createSamashti = async (req, res) => {
  try {
    let data = await Samashti.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "Samashti content already exists. Use PUT to update." });
    }
    data = new Samashti(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateSamashti = async (req, res) => {
  try {
    const data = await Samashti.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "Samashti content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteSamashti = async (req, res) => {
  try {
    const data = await Samashti.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "Samashti content not found." });
    }
    res.status(200).json({ success: true, message: "Samashti content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
