const mongoose = require("mongoose");

// NptelLocalChapter page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const NptelLocalChapterSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const NptelLocalChapter = mongoose.model("NptelLocalChapter", NptelLocalChapterSchema);
module.exports = NptelLocalChapter;
