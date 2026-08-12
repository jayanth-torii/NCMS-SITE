const mongoose = require("mongoose");

// Contact-us / query form submissions from the public site.
const ContactUsFormSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    mobile_number: { type: String },
    subject: { type: String },
    message: { type: String },
    formType: { type: String, default: "Query" },
    formData: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactUsForm", ContactUsFormSchema);
