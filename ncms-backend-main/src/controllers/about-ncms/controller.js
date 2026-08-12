const AboutNcms = require("../../models/about-ncms/model");

// GET /api/<route> — return the single AboutNcms doc
exports.getAboutNcms = async (req, res) => {
  try {
    const data = await AboutNcms.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "AboutNcms content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createAboutNcms = async (req, res) => {
  try {
    let data = await AboutNcms.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "AboutNcms content already exists. Use PUT to update." });
    }
    data = new AboutNcms(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateAboutNcms = async (req, res) => {
  try {
    const data = await AboutNcms.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "AboutNcms content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteAboutNcms = async (req, res) => {
  try {
    const data = await AboutNcms.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "AboutNcms content not found." });
    }
    res.status(200).json({ success: true, message: "AboutNcms content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
