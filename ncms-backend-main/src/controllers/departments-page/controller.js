const DepartmentsPage = require("../../models/departments-page/model");

// GET /api/<route> — return the single DepartmentsPage doc
exports.getDepartmentsPage = async (req, res) => {
  try {
    const data = await DepartmentsPage.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "DepartmentsPage content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createDepartmentsPage = async (req, res) => {
  try {
    let data = await DepartmentsPage.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "DepartmentsPage content already exists. Use PUT to update." });
    }
    data = new DepartmentsPage(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateDepartmentsPage = async (req, res) => {
  try {
    const data = await DepartmentsPage.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "DepartmentsPage content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteDepartmentsPage = async (req, res) => {
  try {
    const data = await DepartmentsPage.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "DepartmentsPage content not found." });
    }
    res.status(200).json({ success: true, message: "DepartmentsPage content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
