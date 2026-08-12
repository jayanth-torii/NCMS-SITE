const Ncc = require("../../models/ncc/model");

// GET /api/<route> — return the single Ncc doc
exports.getNcc = async (req, res) => {
  try {
    const data = await Ncc.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "Ncc content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createNcc = async (req, res) => {
  try {
    let data = await Ncc.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "Ncc content already exists. Use PUT to update." });
    }
    data = new Ncc(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateNcc = async (req, res) => {
  try {
    const data = await Ncc.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "Ncc content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteNcc = async (req, res) => {
  try {
    const data = await Ncc.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "Ncc content not found." });
    }
    res.status(200).json({ success: true, message: "Ncc content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
