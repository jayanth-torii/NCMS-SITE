const mongoose = require("mongoose");

// Iic page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const IicSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const Iic = mongoose.model("Iic", IicSchema);
module.exports = Iic;
