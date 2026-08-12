const mongoose = require("mongoose");

// Samashti page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const SamashtiSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const Samashti = mongoose.model("Samashti", SamashtiSchema);
module.exports = Samashti;
