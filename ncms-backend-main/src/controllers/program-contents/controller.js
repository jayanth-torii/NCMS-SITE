const ProgramContents = require("../../models/program-contents/model");

// GET /api/<route> — return the single ProgramContents doc
exports.getProgramContents = async (req, res) => {
  try {
    const data = await ProgramContents.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "ProgramContents content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createProgramContents = async (req, res) => {
  try {
    let data = await ProgramContents.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "ProgramContents content already exists. Use PUT to update." });
    }
    data = new ProgramContents(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateProgramContents = async (req, res) => {
  try {
    const data = await ProgramContents.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "ProgramContents content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteProgramContents = async (req, res) => {
  try {
    const data = await ProgramContents.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "ProgramContents content not found." });
    }
    res.status(200).json({ success: true, message: "ProgramContents content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
