const mongoose = require("mongoose");

// Library page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const LibrarySchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const Library = mongoose.model("Library", LibrarySchema);
module.exports = Library;
