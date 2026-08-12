const mongoose = require("mongoose");

// CulturalCommittee page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const CulturalCommitteeSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const CulturalCommittee = mongoose.model("CulturalCommittee", CulturalCommitteeSchema);
module.exports = CulturalCommittee;
