const path = require("path");

// Points at the ncms-web-main data-export snapshot. Override with
// DATA_EXPORT_PATH in .env if the two repos aren't checked out as siblings.
const DATA_EXPORT_ROOT =
  process.env.DATA_EXPORT_PATH || path.join(__dirname, "..", "..", "ncms-web-main", "data-export");

module.exports = { DATA_EXPORT_ROOT };
