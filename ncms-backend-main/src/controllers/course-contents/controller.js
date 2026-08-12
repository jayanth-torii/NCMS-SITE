const CourseContents = require("../../models/course-contents/model");

// GET /api/<route> — return the single CourseContents doc
exports.getCourseContents = async (req, res) => {
  try {
    const data = await CourseContents.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "CourseContents content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createCourseContents = async (req, res) => {
  try {
    let data = await CourseContents.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "CourseContents content already exists. Use PUT to update." });
    }
    data = new CourseContents(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateCourseContents = async (req, res) => {
  try {
    const data = await CourseContents.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "CourseContents content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteCourseContents = async (req, res) => {
  try {
    const data = await CourseContents.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "CourseContents content not found." });
    }
    res.status(200).json({ success: true, message: "CourseContents content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
