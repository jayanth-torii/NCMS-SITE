const mongoose = require("mongoose");

// MandatoryDisclosure page content (singleton). The whole page payload is stored verbatim
// in a single Mixed `data` field (same pattern as Home / Placements).
const MandatoryDisclosureSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const MandatoryDisclosure = mongoose.model("MandatoryDisclosure", MandatoryDisclosureSchema);
module.exports = MandatoryDisclosure;
