const ValueAddedCourse = require("../../models/value-added-course/model");

// GET /api/<route> — return the single ValueAddedCourse doc
exports.getValueAddedCourse = async (req, res) => {
  try {
    const data = await ValueAddedCourse.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "ValueAddedCourse content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createValueAddedCourse = async (req, res) => {
  try {
    let data = await ValueAddedCourse.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "ValueAddedCourse content already exists. Use PUT to update." });
    }
    data = new ValueAddedCourse(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateValueAddedCourse = async (req, res) => {
  try {
    const data = await ValueAddedCourse.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "ValueAddedCourse content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteValueAddedCourse = async (req, res) => {
  try {
    const data = await ValueAddedCourse.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "ValueAddedCourse content not found." });
    }
    res.status(200).json({ success: true, message: "ValueAddedCourse content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
