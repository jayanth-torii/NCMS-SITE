const mongoose = require("mongoose");

// SyllabusContents page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const SyllabusContentsSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const SyllabusContents = mongoose.model("SyllabusContents", SyllabusContentsSchema);
module.exports = SyllabusContents;
