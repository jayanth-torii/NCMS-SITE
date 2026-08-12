const mongoose = require("mongoose");

// EdCell page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const EdCellSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const EdCell = mongoose.model("EdCell", EdCellSchema);
module.exports = EdCell;
