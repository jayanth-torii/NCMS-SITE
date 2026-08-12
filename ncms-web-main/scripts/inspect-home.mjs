import fs from "fs";

const d = JSON.parse(fs.readFileSync("data-export/home-page/data.json", "utf8"));

const show = (k, max = 900) => {
  const v = d[k];
  if (v === undefined) { console.log(`### ${k}: MISSING`); return; }
  console.log(`### ${k}: ${Array.isArray(v) ? "array len " + v.length : typeof v}`);
  console.log(JSON.stringify(v).slice(0, max));
  console.log();
};

["banner", "Records", "aboutNcet", "yrs25Section", "accordination", "lifeAtNCMSvideos", "educationData", "exploreBlogs", "glimpse", "placementPartners"].forEach((k) => show(k));
