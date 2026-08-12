const mongoose = require("mongoose");

// SakhiSamrudhi page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const SakhiSamrudhiSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const SakhiSamrudhi = mongoose.model("SakhiSamrudhi", SakhiSamrudhiSchema);
module.exports = SakhiSamrudhi;
