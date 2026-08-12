// Generates one NCET-style module (model + controller + route) per NCMS
// content area. Every content area stores its whole page payload in a single
// Mixed `data` field (the same pattern NCET uses for Home/Placements/Privacy).
//
// Re-run with `npm run generate` if the module list changes — the generated
// files are committed, so don't hand-edit the generated boilerplate.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// name    : PascalCase model name
// route   : mount path under /api (kebab-case)
// fileKey : data-export dir used by the seed system
const MODULES = [
  { name: "AboutNcms", route: "about-ncms", fileKey: "about-ncms-college" },
  { name: "AntiRagging", route: "anti-ragging", fileKey: "anti-ragging" },
  { name: "AntiSexualHarassment", route: "anti-sexual-harassment", fileKey: "anti-sexual-harassment-cell" },
  { name: "ApplyNow", route: "apply-now", fileKey: "apply-now" },
  { name: "AuditReport", route: "audit-report", fileKey: "audit-report" },
  { name: "BlogBanner", route: "blog-banner", fileKey: "blog", pick: "BannerSection" },
  { name: "CommerceForum", route: "commerce-forum", fileKey: "commerce-forum" },
  { name: "ContactUsPage", route: "contact-us-page", fileKey: "contact-us" },
  { name: "CourseContents", route: "course-contents", fileKey: "course-contents" },
  { name: "CulturalCommittee", route: "cultural-committee", fileKey: "cultural-committee" },
  { name: "DepartmentBanners", route: "department-banners", fileKey: "department-banners" },
  { name: "DepartmentFaculties", route: "department-faculties", fileKey: "department-faculties" },
  { name: "DepartmentsPage", route: "departments-page", fileKey: "department-page" },
  { name: "EdCell", route: "ed-cell", fileKey: "ed-cell" },
  { name: "Event", route: "events", fileKey: "event" },
  { name: "Footer", route: "footer", fileKey: "footer" },
  { name: "Gallery", route: "gallery", fileKey: "gallery" },
  { name: "GrievanceRedressal", route: "grievance-redressal", fileKey: "grievenvance-redressal-cell" },
  { name: "HodContents", route: "hod-contents", fileKey: "hod-contents" },
  { name: "Home", route: "home", fileKey: "home-page" },
  { name: "HumanRights", route: "human-rights", fileKey: "human-rights-cell" },
  { name: "Iic", route: "iic", fileKey: "iic" },
  { name: "Iqac", route: "iqac", fileKey: "iqac" },
  { name: "KalaChaitanya", route: "kala-chaitanya", fileKey: "kala-chaitanya" },
  { name: "Library", route: "library", fileKey: "library" },
  { name: "MandatoryDisclosure", route: "mandatory-disclosure", fileKey: "mandatory-disclosure" },
  { name: "Ncc", route: "ncc", fileKey: "ncc" },
  { name: "NewsClippings", route: "news-clippings", fileKey: "news-clippings" },
  { name: "NewsLetter", route: "news-letter", fileKey: "news-letter" },
  { name: "NptelLocalChapter", route: "nptel-local-chapter", fileKey: "nptel-local-chapter" },
  { name: "Nss", route: "nss", fileKey: "nss" },
  { name: "Placement", route: "placement", fileKey: "placement" },
  { name: "PragyanScienceForum", route: "pragyan-science-forum", fileKey: "pragyan-science-forum" },
  { name: "ProgramContents", route: "program-contents", fileKey: "program-contents" },
  { name: "ResearchCell", route: "research-cell", fileKey: "research-cell" },
  { name: "SakhiSamrudhi", route: "sakhi-samrudhi", fileKey: "sakhi-samrudhi-women-empowerment-cell" },
  { name: "Samashti", route: "samashti", fileKey: "samashti" },
  { name: "ScAndSt", route: "sc-and-st", fileKey: "sc-and-st" },
  { name: "StudentCenter", route: "student-center", fileKey: "student-center-content" },
  { name: "SyllabusContents", route: "syllabus-contents", fileKey: "syllabus-contents" },
  { name: "UnityCouncil", route: "unity-council", fileKey: "unity-counsil-content" },
  { name: "Uucms", route: "uucms", fileKey: "uucms-content" },
  { name: "ValueAddedCourse", route: "value-added-course", fileKey: "value-added-course" },
  { name: "VisionMissions", route: "vision-missions", fileKey: "vision-missions" },
];

const modelTpl = (name) => `const mongoose = require("mongoose");

// ${name} page content (singleton). The whole page payload is stored verbatim
// in a single Mixed \`data\` field (same pattern as Home / Placements).
const ${name}Schema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { minimize: false, timestamps: true }
);

const ${name} = mongoose.model("${name}", ${name}Schema);
module.exports = ${name};
`;

const controllerTpl = (name) => `const ${name} = require("../../models/${moduleDir(name)}/model");

// GET /api/<route> — return the single ${name} doc
exports.get${name} = async (req, res) => {
  try {
    const data = await ${name}.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: "${name} content not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/<route> — create (refuses if one already exists)
exports.create${name} = async (req, res) => {
  try {
    let data = await ${name}.findOne();
    if (data) {
      return res.status(400).json({ success: false, message: "${name} content already exists. Use PUT to update." });
    }
    data = new ${name}(req.body);
    await data.save();
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/<route> — update the single doc
exports.update${name} = async (req, res) => {
  try {
    const data = await ${name}.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "${name} content not found. Use POST to create." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/<route> — delete the single doc
exports.delete${name} = async (req, res) => {
  try {
    const data = await ${name}.findOneAndDelete({});
    if (!data) {
      return res.status(404).json({ success: false, message: "${name} content not found." });
    }
    res.status(200).json({ success: true, message: "${name} content deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
`;

const routeTpl = (name, route) => `const express = require("express");
const router = express.Router();
const ${name}Controller = require("../../controllers/${moduleDir(name)}/controller");

// Standard CRUD for the ${name} page content (singleton)
router.post("/${route}", ${name}Controller.create${name});
router.get("/${route}", ${name}Controller.get${name});
router.put("/${route}", ${name}Controller.update${name});
router.delete("/${route}", ${name}Controller.delete${name});

module.exports = router;
`;

function moduleDir(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

let count = 0;
for (const m of MODULES) {
  const dir = moduleDir(m.name);
  const base = path.join(ROOT, "src", "models", dir);
  fs.mkdirSync(base, { recursive: true });
  fs.mkdirSync(path.join(ROOT, "src", "controllers", dir), { recursive: true });
  fs.mkdirSync(path.join(ROOT, "src", "routes", dir), { recursive: true });

  fs.writeFileSync(path.join(base, "model.js"), modelTpl(m.name));
  fs.writeFileSync(path.join(ROOT, "src", "controllers", dir, "controller.js"), controllerTpl(m.name));
  fs.writeFileSync(path.join(ROOT, "src", "routes", dir, "route.js"), routeTpl(m.name, m.route));
  count++;
}

// Also emit the module manifest for seed + admin reuse
fs.writeFileSync(
  path.join(ROOT, "src", "config", "contentModules.json"),
  JSON.stringify(MODULES, null, 2)
);

console.log(`Generated ${count} content modules.`);
