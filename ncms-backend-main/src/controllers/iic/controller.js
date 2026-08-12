const Iic = require("../../models/iic/model");

// GET /api/<route> — return the single Iic doc
exports.getIic = async (req, res) => {
  try {
    const data = await Iic.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "Iic content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createIic = async (req, res) => {
  try {
    let data = await Iic.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "Iic content already exists. Use PUT to update." });
    }
    data = new Iic(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateIic = async (req, res) => {
  try {
    const data = await Iic.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "Iic content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteIic = async (req, res) => {
  try {
    const data = await Iic.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "Iic content not found." });
    }
    res.status(200).json({ success: true, message: "Iic content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
