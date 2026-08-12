const mongoose = require("mongoose");

// CommerceForum page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const CommerceForumSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const CommerceForum = mongoose.model("CommerceForum", CommerceForumSchema);
module.exports = CommerceForum;
