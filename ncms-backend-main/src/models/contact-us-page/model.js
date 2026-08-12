const mongoose = require("mongoose");

// ContactUsPage page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const ContactUsPageSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const ContactUsPage = mongoose.model("ContactUsPage", ContactUsPageSchema);
module.exports = ContactUsPage;
