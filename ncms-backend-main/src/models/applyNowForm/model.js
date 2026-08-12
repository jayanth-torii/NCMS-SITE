const mongoose = require("mongoose");

// Apply-now form submissions from the public site.
const ApplyNowFormSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    mobile_number: { type: String },
    program: { type: String },
    course: { type: String },
    message: { type: String },
    formData: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ApplyNowForm", ApplyNowFormSchema);
