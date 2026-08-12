const mongoose = require("mongoose");

// KalaChaitanya page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const KalaChaitanyaSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const KalaChaitanya = mongoose.model("KalaChaitanya", KalaChaitanyaSchema);
module.exports = KalaChaitanya;
