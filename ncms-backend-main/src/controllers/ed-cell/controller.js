const EdCell = require("../../models/ed-cell/model");

// GET /api/<route> — return the single EdCell doc
exports.getEdCell = async (req, res) => {
  try {
    const data = await EdCell.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "EdCell content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createEdCell = async (req, res) => {
  try {
    let data = await EdCell.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "EdCell content already exists. Use PUT to update." });
    }
    data = new EdCell(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateEdCell = async (req, res) => {
  try {
    const data = await EdCell.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "EdCell content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteEdCell = async (req, res) => {
  try {
    const data = await EdCell.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "EdCell content not found." });
    }
    res.status(200).json({ success: true, message: "EdCell content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
