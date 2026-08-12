const Nss = require("../../models/nss/model");

// GET /api/<route> — return the single Nss doc
exports.getNss = async (req, res) => {
  try {
    const data = await Nss.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "Nss content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createNss = async (req, res) => {
  try {
    let data = await Nss.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "Nss content already exists. Use PUT to update." });
    }
    data = new Nss(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateNss = async (req, res) => {
  try {
    const data = await Nss.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "Nss content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteNss = async (req, res) => {
  try {
    const data = await Nss.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "Nss content not found." });
    }
    res.status(200).json({ success: true, message: "Nss content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
