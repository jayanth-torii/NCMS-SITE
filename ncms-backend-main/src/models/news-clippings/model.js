const mongoose = require("mongoose");

// NewsClippings page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const NewsClippingsSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const NewsClippings = mongoose.model("NewsClippings", NewsClippingsSchema);
module.exports = NewsClippings;
