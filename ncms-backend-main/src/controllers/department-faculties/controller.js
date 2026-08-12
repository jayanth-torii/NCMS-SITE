const DepartmentFaculties = require("../../models/department-faculties/model");

// GET /api/<route> — return the single DepartmentFaculties doc
exports.getDepartmentFaculties = async (req, res) => {
  try {
    const data = await DepartmentFaculties.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "DepartmentFaculties content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createDepartmentFaculties = async (req, res) => {
  try {
    let data = await DepartmentFaculties.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "DepartmentFaculties content already exists. Use PUT to update." });
    }
    data = new DepartmentFaculties(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateDepartmentFaculties = async (req, res) => {
  try {
    const data = await DepartmentFaculties.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "DepartmentFaculties content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteDepartmentFaculties = async (req, res) => {
  try {
    const data = await DepartmentFaculties.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "DepartmentFaculties content not found." });
    }
    res.status(200).json({ success: true, message: "DepartmentFaculties content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
