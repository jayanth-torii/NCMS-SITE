const Uucms = require("../../models/uucms/model");

// GET /api/<route> — return the single Uucms doc
exports.getUucms = async (req, res) => {
  try {
    const data = await Uucms.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "Uucms content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createUucms = async (req, res) => {
  try {
    let data = await Uucms.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "Uucms content already exists. Use PUT to update." });
    }
    data = new Uucms(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateUucms = async (req, res) => {
  try {
    const data = await Uucms.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "Uucms content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteUucms = async (req, res) => {
  try {
    const data = await Uucms.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "Uucms content not found." });
    }
    res.status(200).json({ success: true, message: "Uucms content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
