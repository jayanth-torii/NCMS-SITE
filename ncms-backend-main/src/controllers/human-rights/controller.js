const HumanRights = require("../../models/human-rights/model");

// GET /api/<route> — return the single HumanRights doc
exports.getHumanRights = async (req, res) => {
  try {
    const data = await HumanRights.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "HumanRights content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createHumanRights = async (req, res) => {
  try {
    let data = await HumanRights.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "HumanRights content already exists. Use PUT to update." });
    }
    data = new HumanRights(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateHumanRights = async (req, res) => {
  try {
    const data = await HumanRights.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "HumanRights content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteHumanRights = async (req, res) => {
  try {
    const data = await HumanRights.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "HumanRights content not found." });
    }
    res.status(200).json({ success: true, message: "HumanRights content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
