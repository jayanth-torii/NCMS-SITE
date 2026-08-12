const mongoose = require("mongoose");

// ProgramContents page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const ProgramContentsSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const ProgramContents = mongoose.model("ProgramContents", ProgramContentsSchema);
module.exports = ProgramContents;
