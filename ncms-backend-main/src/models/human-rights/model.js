const mongoose = require("mongoose");

// HumanRights page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const HumanRightsSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const HumanRights = mongoose.model("HumanRights", HumanRightsSchema);
module.exports = HumanRights;
