const fs = require("fs");
const path = require("path");

// Requires every models/<module>/model.js once so each Mongoose model is
// registered, without needing a separate hand-maintained name->path map.
function loadAllModels() {
  const modelsRoot = path.join(__dirname, "..", "src", "models");
  for (const dir of fs.readdirSync(modelsRoot)) {
    const modelFile = path.join(modelsRoot, dir, "model.js");
    if (fs.existsSync(modelFile)) require(modelFile);
  }
}

module.exports = { loadAllModels };
