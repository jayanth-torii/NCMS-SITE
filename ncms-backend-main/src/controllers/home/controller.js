const Home = require("../../models/home/model");

// GET /api/<route> — return the single Home doc
exports.getHome = async (req, res) => {
  try {
    const data = await Home.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "Home content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createHome = async (req, res) => {
  try {
    let data = await Home.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "Home content already exists. Use PUT to update." });
    }
    data = new Home(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateHome = async (req, res) => {
  try {
    const data = await Home.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "Home content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteHome = async (req, res) => {
  try {
    const data = await Home.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "Home content not found." });
    }
    res.status(200).json({ success: true, message: "Home content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
