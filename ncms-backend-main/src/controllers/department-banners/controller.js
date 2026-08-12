const DepartmentBanners = require("../../models/department-banners/model");

// GET /api/<route> — return the single DepartmentBanners doc
exports.getDepartmentBanners = async (req, res) => {
  try {
    const data = await DepartmentBanners.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "DepartmentBanners content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createDepartmentBanners = async (req, res) => {
  try {
    let data = await DepartmentBanners.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "DepartmentBanners content already exists. Use PUT to update." });
    }
    data = new DepartmentBanners(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateDepartmentBanners = async (req, res) => {
  try {
    const data = await DepartmentBanners.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "DepartmentBanners content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteDepartmentBanners = async (req, res) => {
  try {
    const data = await DepartmentBanners.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "DepartmentBanners content not found." });
    }
    res.status(200).json({ success: true, message: "DepartmentBanners content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
