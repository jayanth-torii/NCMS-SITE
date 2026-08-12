#!/usr/bin/env node
/**
 * download-media.mjs
 *
 * Scans every file in data-export/** for media URLs (S3-hosted images and
 * PDFs), downloads each unique asset into public/images or public/pdfs
 * (mirroring the S3 key), and rewrites the JSON to reference the local path.
 *
 * Usage: node scripts/download-media.mjs
 */
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "data-export");
const PUBLIC_DIR = join(ROOT, "public");

const MEDIA_HOSTS = [
  "ncms-web.s3-accelerate.amazonaws.com",
  "ncms-web.s3.ap-south-1.amazonaws.com",
  "s3.ap-south-1.amazonaws.com",
];

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif", ".ico"]);
const PDF_EXT = new Set([".pdf"]);
// Other downloadable docs (rare) — store under public/pdfs too for simplicity
const DOC_EXT = new Set([".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".zip"]);

const report = {
  downloadedAt: new Date().toISOString(),
  totalUrls: 0,
  uniqueUrls: 0,
  downloaded: 0,
  skippedExisting: 0,
  failed: [],
  rewrittenFiles: [],
};

// ---------- walk data-export tree ----------
async function listJsonFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listJsonFiles(full)));
    else if (entry.name.endsWith(".json")) out.push(full);
  }
  return out;
}

// ---------- collect media URLs from a value tree ----------
const urlPattern =
  /https?:\/\/((?:ncms-web\.s3-accelerate|ncms-web\.s3|s3)\.(?:amazonaws\.com|ap-south-1\.amazonaws\.com))[^\s"'`)\]}]*/g;

function collectUrls(value, urls) {
  if (typeof value === "string") {
    for (const m of value.matchAll(urlPattern)) {
      const url = m[0].replace(/[),.;]+$/, "");
      urls.add(url);
    }
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectUrls(v, urls));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => collectUrls(v, urls));
  }
}

function classify(url) {
  try {
    const u = new URL(url);
    const ext = extname(u.pathname).toLowerCase();
    if (IMAGE_EXT.has(ext)) return "images";
    if (PDF_EXT.has(ext) || DOC_EXT.has(ext)) return "pdfs";
  } catch {
    /* ignore malformed */
  }
  return null;
}

function localPathFor(url, kind) {
  const u = new URL(url);
  // Mirror the S3 key: strip leading slash, keep subfolders if any
  let key = decodeURIComponent(u.pathname).replace(/^\//, "");
  // Sanitize for local FS
  key = key.replace(/[/\\]/g, "_").replace(/[^a-zA-Z0-9._-]/g, "_");
  if (!key) key = "asset" + extname(u.pathname);
  return join(PUBLIC_DIR, kind, key);
}

async function download(url, dest) {
  try {
    await stat(dest);
    return "existing";
  } catch {
    /* not present, download */
  }
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status} for ${url}`);
  await pipeline(res.body, createWriteStream(dest));
  return "downloaded";
}

// Rewrite all URLs in a value tree in place
function rewrite(value, map) {
  if (typeof value === "string") {
    if (map.has(value)) return map.get(value);
    // also handle URLs embedded in longer strings (rare)
    let out = value;
    for (const [remote, local] of map) {
      if (out.includes(remote)) out = out.split(remote).join(local);
    }
    return out;
  }
  if (Array.isArray(value)) return value.map((v) => rewrite(v, map));
  if (value && typeof value === "object") {
    const o = {};
    for (const [k, v] of Object.entries(value)) o[k] = rewrite(v, map);
    return o;
  }
  return value;
}

async function main() {
  const files = await listJsonFiles(DATA_DIR);
  const urls = new Set();
  for (const f of files) {
    let json;
    try {
      json = JSON.parse(await readFile(f, "utf8"));
    } catch {
      continue;
    }
    collectUrls(json, urls);
  }

  report.totalUrls = urls.size;

  // Build url -> local path map (dedupe by kind+key)
  const map = new Map();
  for (const url of urls) {
    const kind = classify(url);
    if (!kind) continue;
    const local = localPathFor(url, kind);
    map.set(url, `/${kind}/${local.split(/[\\/]/).pop()}`);
  }
  report.uniqueUrls = map.size;

  // Download unique URLs
  let i = 0;
  for (const [url, local] of map) {
    i++;
    const kind = classify(url);
    const dest = join(PUBLIC_DIR, kind, local.replace(`/${kind}/`, ""));
    try {
      const result = await download(url, dest);
      if (result === "downloaded") {
        report.downloaded++;
        console.log(`DL ${local}`);
      } else {
        report.skippedExisting++;
      }
    } catch (err) {
      report.failed.push({ url, error: err.message });
      console.error(`FAIL ${url}: ${err.message}`);
    }
    if (i % 20 === 0) console.log(`... ${i}/${map.size}`);
  }

  // Rewrite JSONs
  for (const f of files) {
    let json;
    try {
      json = JSON.parse(await readFile(f, "utf8"));
    } catch {
      continue;
    }
    const rewritten = rewrite(json, map);
    if (JSON.stringify(rewritten) !== JSON.stringify(json)) {
      await writeFile(f, JSON.stringify(rewritten, null, 2), "utf8");
      report.rewrittenFiles.push(f.replace(/\\/g, "/").replace(ROOT.replace(/\\/g, "/") + "/", ""));
    }
  }

  await writeFile(join(DATA_DIR, "_media-report.json"), JSON.stringify(report, null, 2), "utf8");
  console.log(`\nDone: ${report.downloaded} downloaded, ${report.skippedExisting} existing, ${report.failed.length} failed`);
  console.log(`Rewrote ${report.rewrittenFiles.length} JSON files`);
  if (report.failed.length) console.error("Failures:", report.failed);
}

main();
