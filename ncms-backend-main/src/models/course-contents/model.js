const mongoose = require("mongoose");

// CourseContents page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const CourseContentsSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const CourseContents = mongoose.model("CourseContents", CourseContentsSchema);
module.exports = CourseContents;
