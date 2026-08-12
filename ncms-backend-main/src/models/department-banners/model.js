const mongoose = require("mongoose");

// DepartmentBanners page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const DepartmentBannersSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const DepartmentBanners = mongoose.model("DepartmentBanners", DepartmentBannersSchema);
module.exports = DepartmentBanners;
