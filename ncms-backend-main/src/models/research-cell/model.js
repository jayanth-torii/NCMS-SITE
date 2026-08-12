const mongoose = require("mongoose");

// ResearchCell page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const ResearchCellSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const ResearchCell = mongoose.model("ResearchCell", ResearchCellSchema);
module.exports = ResearchCell;
