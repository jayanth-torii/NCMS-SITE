const mongoose = require("mongoose");

// GrievanceRedressal page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const GrievanceRedressalSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const GrievanceRedressal = mongoose.model("GrievanceRedressal", GrievanceRedressalSchema);
module.exports = GrievanceRedressal;
