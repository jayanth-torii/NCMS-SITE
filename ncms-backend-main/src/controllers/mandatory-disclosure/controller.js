const MandatoryDisclosure = require("../../models/mandatory-disclosure/model");

// GET /api/<route> — return the single MandatoryDisclosure doc
exports.getMandatoryDisclosure = async (req, res) => {
  try {
    const data = await MandatoryDisclosure.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "MandatoryDisclosure content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createMandatoryDisclosure = async (req, res) => {
  try {
    let data = await MandatoryDisclosure.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "MandatoryDisclosure content already exists. Use PUT to update." });
    }
    data = new MandatoryDisclosure(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateMandatoryDisclosure = async (req, res) => {
  try {
    const data = await MandatoryDisclosure.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "MandatoryDisclosure content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteMandatoryDisclosure = async (req, res) => {
  try {
    const data = await MandatoryDisclosure.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "MandatoryDisclosure content not found." });
    }
    res.status(200).json({ success: true, message: "MandatoryDisclosure content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
