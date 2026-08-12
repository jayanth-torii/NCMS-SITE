const HodContents = require("../../models/hod-contents/model");

// GET /api/<route> — return the single HodContents doc
exports.getHodContents = async (req, res) => {
  try {
    const data = await HodContents.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "HodContents content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createHodContents = async (req, res) => {
  try {
    let data = await HodContents.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "HodContents content already exists. Use PUT to update." });
    }
    data = new HodContents(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateHodContents = async (req, res) => {
  try {
    const data = await HodContents.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "HodContents content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteHodContents = async (req, res) => {
  try {
    const data = await HodContents.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "HodContents content not found." });
    }
    res.status(200).json({ success: true, message: "HodContents content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
