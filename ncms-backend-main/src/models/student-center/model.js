const mongoose = require("mongoose");

// StudentCenter page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const StudentCenterSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const StudentCenter = mongoose.model("StudentCenter", StudentCenterSchema);
module.exports = StudentCenter;
