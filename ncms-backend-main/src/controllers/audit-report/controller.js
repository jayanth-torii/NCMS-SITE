const AuditReport = require("../../models/audit-report/model");

// GET /api/<route> — return the single AuditReport doc
exports.getAuditReport = async (req, res) => {
  try {
    const data = await AuditReport.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "AuditReport content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createAuditReport = async (req, res) => {
  try {
    let data = await AuditReport.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "AuditReport content already exists. Use PUT to update." });
    }
    data = new AuditReport(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateAuditReport = async (req, res) => {
  try {
    const data = await AuditReport.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "AuditReport content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteAuditReport = async (req, res) => {
  try {
    const data = await AuditReport.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "AuditReport content not found." });
    }
    res.status(200).json({ success: true, message: "AuditReport content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
