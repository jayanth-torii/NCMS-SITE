const mongoose = require("mongoose");

// Ncc page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const NccSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const Ncc = mongoose.model("Ncc", NccSchema);
module.exports = Ncc;
