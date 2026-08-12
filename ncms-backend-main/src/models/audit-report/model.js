const mongoose = require("mongoose");

// AuditReport page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const AuditReportSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const AuditReport = mongoose.model("AuditReport", AuditReportSchema);
module.exports = AuditReport;
