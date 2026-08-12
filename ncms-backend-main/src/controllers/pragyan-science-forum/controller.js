const PragyanScienceForum = require("../../models/pragyan-science-forum/model");

// GET /api/<route> — return the single PragyanScienceForum doc
exports.getPragyanScienceForum = async (req, res) => {
  try {
    const data = await PragyanScienceForum.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "PragyanScienceForum content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createPragyanScienceForum = async (req, res) => {
  try {
    let data = await PragyanScienceForum.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "PragyanScienceForum content already exists. Use PUT to update." });
    }
    data = new PragyanScienceForum(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updatePragyanScienceForum = async (req, res) => {
  try {
    const data = await PragyanScienceForum.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "PragyanScienceForum content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deletePragyanScienceForum = async (req, res) => {
  try {
    const data = await PragyanScienceForum.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "PragyanScienceForum content not found." });
    }
    res.status(200).json({ success: true, message: "PragyanScienceForum content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
