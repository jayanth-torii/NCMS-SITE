require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const { loadAllModels } = require("./loadModels");
const { DATA_EXPORT_ROOT } = require("./dataExportPath");
const { seedBlog } = require("./seedBlog");

// Strapi bookkeeping keys that appear at the top level of the export JSONs.
// They are never part of the page content, so they're stripped before storing.
const META_KEYS = new Set([
  "id",
  "documentId",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "locale",
]);

function stripMeta(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const out = {};
    for (const [k, v] of Object.entries(data)) {
      if (META_KEYS.has(k)) continue;
      out[k] = v;
    }
    return out;
  }
  return data;
}

async function seedSingletons() {
  const manifestPath = path.join(__dirname, "..", "src", "config", "contentModules.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  let count = 0;
  for (const entry of manifest) {
    const Model = mongoose.model(entry.name);
    const file = path.join(DATA_EXPORT_ROOT, entry.fileKey, "data.json");
    if (!fs.existsSync(file)) {
      console.warn(`Skipping ${entry.name}: file not found (${entry.fileKey})`);
      continue;
    }
    const json = JSON.parse(fs.readFileSync(file, "utf8"));
    let data = json;
    if (entry.pick) data = json[entry.pick];
    if (data === undefined || data === null) {
      console.warn(`Skipping ${entry.name}: pick "${entry.pick}" missing in ${entry.fileKey}`);
      continue;
    }
    data = stripMeta(data);

    await Model.findOneAndUpdate(
      {},
      { data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    count++;
  }
  console.log(`Seeded ${count}/${manifest.length} singleton models.`);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for seeding.");
  loadAllModels();

  await seedSingletons();
  await seedBlog();

  await mongoose.disconnect();
  console.log("Seed complete.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
