const mongoose = require("mongoose");

// Nss page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const NssSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const Nss = mongoose.model("Nss", NssSchema);
module.exports = Nss;
