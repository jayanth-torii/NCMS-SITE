// Shape-inference helpers that let the generic editor render a proper field
// for any Mixed-data JSON value without a backend schema. Detection is
// heuristic (key name + value shape) — same approach as NCET/NDC.

const ACRONYMS = {
  pdf: "PDF",
  url: "URL",
  id: "ID",
  iic: "IIC",
  iqac: "IQAC",
  nirf: "NIRF",
  ncc: "NCC",
  nss: "NSS",
  hod: "HOD",
  ug: "UG",
  pg: "PG",
  bca: "BCA",
  bba: "BBA",
  mba: "MBA",
  mca: "MCA",
  ed: "ED",
  sc: "SC",
  st: "ST",
  uucms: "UUCMS",
  nptel: "NPTEL",
};

export function humanize(key) {
  if (key == null || typeof key !== "string") return "";
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return spaced
    .split(" ")
    .filter(Boolean)
    .map((w) => {
      const lower = w.toLowerCase();
      if (ACRONYMS[lower]) return ACRONYMS[lower];
      return w[0].toUpperCase() + w.slice(1);
    })
    .join(" ");
}

// Internal/technical bookkeeping keys — never rendered, but preserved as-is.
export const HIDDEN_KEYS = new Set([
  "_id",
  "__v",
  "id",
  "documentId",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "locale",
]);

const IMAGE_KEY_RE = /image|banner|logo|photo|cover|avatar|picture|gallery|thumbnail|img/i;
const PDF_KEY_RE = /pdf|brochure|document|newsletter.?file|syllabus.?file|certificate.?file|circular|report.?file|manual.?file/i;
const IMAGE_VALUE_RE = /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i;
const PDF_VALUE_RE = /\.pdf(\?.*)?$/i;

export function isImageField(key, value) {
  if (typeof value === "string" && IMAGE_VALUE_RE.test(value)) return true;
  if ((value == null || value === "") && IMAGE_KEY_RE.test(key)) return true;
  return false;
}

export function isPdfField(key, value) {
  if (typeof value === "string" && PDF_VALUE_RE.test(value)) return true;
  if ((value == null || value === "") && PDF_KEY_RE.test(key)) return true;
  return false;
}

const MAP_LOCATION_KEY_RE = /location|map|addressLink|maps/i;
const MAP_LOCATION_VALUE_RE = /google\.com\/maps|maps\.app\.goo\.gl|google\.com.*?mapclient/i;

export function isMapLocationField(key, value) {
  if (typeof value === "string" && MAP_LOCATION_VALUE_RE.test(value)) return true;
  if ((value == null || value === "") && MAP_LOCATION_KEY_RE.test(key)) return true;
  return false;
}

const YOUTUBE_KEY_RE = /youtube|video|yt/i;

export function isYoutubeField(key, value) {
  if (typeof value === "string" && /^[a-zA-Z0-9_-]{11}$/.test(value)) return true;
  if ((value == null || value === "") && YOUTUBE_KEY_RE.test(key)) return true;
  return false;
}

// Builds a same-shape "blank" value from a sample — used when adding a new
// array item (clone shape, blank the values).
export function emptyLike(sample) {
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    const out = {};
    for (const [k, v] of Object.entries(sample)) {
      out[k] = typeof v === "string" ? "" : Array.isArray(v) ? [] : v && typeof v === "object" ? {} : v;
    }
    return out;
  }
  return "";
}
