const mongoose = require("mongoose");

// ScAndSt page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const ScAndStSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const ScAndSt = mongoose.model("ScAndSt", ScAndStSchema);
module.exports = ScAndSt;
