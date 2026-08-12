const ApplyNowForm = require("../../models/applyNowForm/model");

// Public form POST — creates a submission (no auth required)
exports.createApplyNowForm = async (req, res) => {
  try {
    const submission = new ApplyNowForm({ ...req.body, formData: req.body });
    const saved = await submission.save();
    res.status(201).json({ success: true, message: "Application submitted", data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin: list submissions
exports.getApplyNowForms = async (req, res) => {
  try {
    const forms = await ApplyNowForm.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: forms.length, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: delete a submission
exports.deleteApplyNowForm = async (req, res) => {
  try {
    const form = await ApplyNowForm.findByIdAndDelete(req.params.id);
    if (!form) return res.status(404).json({ success: false, message: "Submission not found" });
    res.status(200).json({ success: true, message: "Submission deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
