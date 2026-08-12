const GrievanceRedressal = require("../../models/grievance-redressal/model");

// GET /api/<route> — return the single GrievanceRedressal doc
exports.getGrievanceRedressal = async (req, res) => {
  try {
    const data = await GrievanceRedressal.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "GrievanceRedressal content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createGrievanceRedressal = async (req, res) => {
  try {
    let data = await GrievanceRedressal.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "GrievanceRedressal content already exists. Use PUT to update." });
    }
    data = new GrievanceRedressal(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateGrievanceRedressal = async (req, res) => {
  try {
    const data = await GrievanceRedressal.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "GrievanceRedressal content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteGrievanceRedressal = async (req, res) => {
  try {
    const data = await GrievanceRedressal.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "GrievanceRedressal content not found." });
    }
    res.status(200).json({ success: true, message: "GrievanceRedressal content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
