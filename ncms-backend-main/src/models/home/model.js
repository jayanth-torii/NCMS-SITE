const mongoose = require("mongoose");

// Home page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const HomeSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const Home = mongoose.model("Home", HomeSchema);
module.exports = Home;
