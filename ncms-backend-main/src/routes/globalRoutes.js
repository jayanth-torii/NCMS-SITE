const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// ---- Custom (non-generated) modules ----
router.use("/", require("./auth/route")); // /api/login-user, /api/login-verify, /api/me
router.use("/", require("./user/route")); // /api/users
router.use("/", require("./blog/route")); // /api/blogs
router.use("/", require("./applyNowForm/route")); // /api/apply-now-forms
router.use("/", require("./contactUsForm/route")); // /api/contact-us-forms
router.use("/upload", require("./uploadRoutes")); // /api/upload

// ---- Generated content modules (see scripts/generateModules.js) ----
// Every routes/<module>/route.js exports a router that declares its own full
// path (e.g. router.get("/home", ...)), so we mount each at the router root.
const routesRoot = __dirname;
for (const dir of fs.readdirSync(routesRoot)) {
  const routeFile = path.join(routesRoot, dir, "route.js");
  if (!fs.existsSync(routeFile)) continue;
  // Skip the files above (already mounted) and the aggregator itself.
  if (["globalRoutes.js", "uploadRoutes.js"].includes(dir)) continue;
  try {
    router.use("/", require(routeFile));
  } catch (err) {
    console.error(`Failed to load route module: ${dir}`, err.message);
  }
}

module.exports = router;
