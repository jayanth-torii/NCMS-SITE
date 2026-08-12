const CommerceForum = require("../../models/commerce-forum/model");

// GET /api/<route> — return the single CommerceForum doc
exports.getCommerceForum = async (req, res) => {
  try {
    const data = await CommerceForum.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "CommerceForum content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createCommerceForum = async (req, res) => {
  try {
    let data = await CommerceForum.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "CommerceForum content already exists. Use PUT to update." });
    }
    data = new CommerceForum(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateCommerceForum = async (req, res) => {
  try {
    const data = await CommerceForum.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "CommerceForum content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteCommerceForum = async (req, res) => {
  try {
    const data = await CommerceForum.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "CommerceForum content not found." });
    }
    res.status(200).json({ success: true, message: "CommerceForum content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
