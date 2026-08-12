const mongoose = require("mongoose");

// Iqac page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const IqacSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const Iqac = mongoose.model("Iqac", IqacSchema);
module.exports = Iqac;
