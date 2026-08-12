const Event = require("../../models/event/model");

// GET /api/<route> — return the single Event doc
exports.getEvent = async (req, res) => {
  try {
    const data = await Event.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "Event content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.createEvent = async (req, res) => {
  try {
    let data = await Event.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "Event content already exists. Use PUT to update." });
    }
    data = new Event(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.updateEvent = async (req, res) => {
  try {
    const data = await Event.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "Event content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.deleteEvent = async (req, res) => {
  try {
    const data = await Event.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "Event content not found." });
    }
    res.status(200).json({ success: true, message: "Event content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
