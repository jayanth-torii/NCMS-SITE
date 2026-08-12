const mongoose = require("mongoose");

// DepartmentsPage page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const DepartmentsPageSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const DepartmentsPage = mongoose.model("DepartmentsPage", DepartmentsPageSchema);
module.exports = DepartmentsPage;
