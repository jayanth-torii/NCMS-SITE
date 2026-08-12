const mongoose = require("mongoose");

// ValueAddedCourse page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const ValueAddedCourseSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const ValueAddedCourse = mongoose.model("ValueAddedCourse", ValueAddedCourseSchema);
module.exports = ValueAddedCourse;
