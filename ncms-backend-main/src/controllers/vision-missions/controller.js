const VisionMissions = require("../../models/vision-missions/model");

// GET /api/<route> — return the single VisionMissions doc
exports.getVisionMissions = async (req, res) => {
  try {
    const data = await VisionMissions.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "VisionMissions content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createVisionMissions = async (req, res) => {
  try {
    let data = await VisionMissions.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "VisionMissions content already exists. Use PUT to update." });
    }
    data = new VisionMissions(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateVisionMissions = async (req, res) => {
  try {
    const data = await VisionMissions.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "VisionMissions content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteVisionMissions = async (req, res) => {
  try {
    const data = await VisionMissions.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "VisionMissions content not found." });
    }
    res.status(200).json({ success: true, message: "VisionMissions content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
