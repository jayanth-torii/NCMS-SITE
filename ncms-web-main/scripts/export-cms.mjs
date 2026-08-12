#!/usr/bin/env node
/**
 * export-cms.mjs
 *
 * Fetches every CMS endpoint the NCMS frontend actually consumes (verified
 * live on 2026-08-10: all return HTTP 200) and writes a point-in-time JSON
 * snapshot into `data-export/`, mirroring the NDC project's migration pattern.
 *
 * Each endpoint's payload is stored as `data-export/<slug>/data.json` —
 * the raw Strapi `{ data: ... }` object is unwrapped so components can
 * `import data from "@/data-export/<slug>/data.json"` and use it exactly
 * like they previously used `response.data.data`.
 *
 * Usage: node scripts/export-cms.mjs
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "data-export");
const BASE_URL = process.env.CMS_BASE_URL || "https://cms.ncms.co.in/api";

// Every endpoint the frontend calls (page/component -> endpoint slug).
// Verified HTTP 200 against the live CMS.
const ENDPOINTS = [
  // pages (app/*)
  "about-ncms-college",
  "apply-now",
  "audit-report",
  "blog",
  "contact-us",
  "department-page",
  "gallery",
  "home-page",
  "iic",
  "iqac",
  "mandatory-disclosure",
  "news-clippings",
  "news-letter",
  "placement",
  "samashti",
  "student-center-content",
  "uucms-content",
  "event",
  // shared
  "footer",
  // departments (components/Departments/*)
  "department-banners",
  "course-contents",
  "vision-missions",
  "syllabus-contents",
  "program-contents",
  "hod-contents",
  "department-faculties",
  // student center - statutory cells
  "anti-ragging",
  "anti-sexual-harassment-cell",
  "human-rights-cell",
  "grievenvance-redressal-cell",
  "sc-and-st",
  "unity-counsil-content",
  // student center - academic enrichment
  "commerce-forum",
  "ed-cell",
  "library",
  "nptel-local-chapter",
  "pragyan-science-forum",
  "research-cell",
  "value-added-course",
  // student center - community services
  "cultural-committee",
  "kala-chaitanya",
  "ncc",
  "nss",
  "sakhi-samrudhi-women-empowerment-cell",
];

const report = {
  fetchedAt: new Date().toISOString(),
  baseUrl: BASE_URL,
  pages: {},
  errors: [],
};

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  let ok = 0;

  for (const slug of ENDPOINTS) {
    const url = `${BASE_URL}/${slug}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      const text = await res.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 120)}`);
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 160)}`);
      }

      // Unwrap Strapi's { data: ... } envelope so the JSON mirrors what the
      // frontend used to receive via response.data.data.
      const payload = json && typeof json === "object" && "data" in json ? json.data : json;

      const file = join(OUT_DIR, slug, "data.json");
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, JSON.stringify(payload, null, 2), "utf8");

      report.pages[slug] = {
        file: `data-export/${slug}/data.json`,
        bytes: Buffer.byteLength(text),
      };
      ok++;
      console.log(`OK   ${slug.padEnd(40)} ${Buffer.byteLength(text)} bytes`);
    } catch (err) {
      report.errors.push({ slug, error: err.message });
      console.error(`FAIL ${slug.padEnd(40)} ${err.message}`);
    }
  }

  await writeFile(join(OUT_DIR, "_extraction-report.json"), JSON.stringify(report, null, 2), "utf8");
  console.log(`\nDone: ${ok}/${ENDPOINTS.length} endpoints exported → ${OUT_DIR}`);
  if (report.errors.length) {
    console.error("Errors:", report.errors);
    process.exitCode = 1;
  }
}

main();
