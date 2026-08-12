const Placement = require("../../models/placement/model");

// GET /api/<route> — return the single Placement doc
exports.getPlacement = async (req, res) => {
  try {
    const data = await Placement.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "Placement content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createPlacement = async (req, res) => {
  try {
    let data = await Placement.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "Placement content already exists. Use PUT to update." });
    }
    data = new Placement(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updatePlacement = async (req, res) => {
  try {
    const data = await Placement.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "Placement content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deletePlacement = async (req, res) => {
  try {
    const data = await Placement.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "Placement content not found." });
    }
    res.status(200).json({ success: true, message: "Placement content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
