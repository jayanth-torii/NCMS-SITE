const KalaChaitanya = require("../../models/kala-chaitanya/model");

// GET /api/<route> — return the single KalaChaitanya doc
exports.getKalaChaitanya = async (req, res) => {
  try {
    const data = await KalaChaitanya.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "KalaChaitanya content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createKalaChaitanya = async (req, res) => {
  try {
    let data = await KalaChaitanya.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "KalaChaitanya content already exists. Use PUT to update." });
    }
    data = new KalaChaitanya(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateKalaChaitanya = async (req, res) => {
  try {
    const data = await KalaChaitanya.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "KalaChaitanya content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteKalaChaitanya = async (req, res) => {
  try {
    const data = await KalaChaitanya.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "KalaChaitanya content not found." });
    }
    res.status(200).json({ success: true, message: "KalaChaitanya content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
