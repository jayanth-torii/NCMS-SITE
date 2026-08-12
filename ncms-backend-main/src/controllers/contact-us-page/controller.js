const ContactUsPage = require("../../models/contact-us-page/model");

// GET /api/<route> — return the single ContactUsPage doc
exports.getContactUsPage = async (req, res) => {
  try {
    const data = await ContactUsPage.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "ContactUsPage content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createContactUsPage = async (req, res) => {
  try {
    let data = await ContactUsPage.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "ContactUsPage content already exists. Use PUT to update." });
    }
    data = new ContactUsPage(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateContactUsPage = async (req, res) => {
  try {
    const data = await ContactUsPage.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "ContactUsPage content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteContactUsPage = async (req, res) => {
  try {
    const data = await ContactUsPage.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "ContactUsPage content not found." });
    }
    res.status(200).json({ success: true, message: "ContactUsPage content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
