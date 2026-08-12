const Footer = require("../../models/footer/model");

// GET /api/<route> — return the single Footer doc
exports.getFooter = async (req, res) => {
  try {
    const data = await Footer.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "Footer content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createFooter = async (req, res) => {
  try {
    let data = await Footer.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "Footer content already exists. Use PUT to update." });
    }
    data = new Footer(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateFooter = async (req, res) => {
  try {
    const data = await Footer.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "Footer content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteFooter = async (req, res) => {
  try {
    const data = await Footer.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "Footer content not found." });
    }
    res.status(200).json({ success: true, message: "Footer content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
