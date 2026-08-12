// Resolve a stored media path into a previewable URL.
// - /uploads/.. files live on the backend (port 4001) — and are also copied
//   into the web's public folder, so the web serves them at /uploads/...
// - Everything else (images/pdfs/...) resolves to the web origin at runtime;
//   in the admin we fall back to the backend host so previews always work.
const API_BASE = (process.env.REACT_APP_BACKENDURL || "http://localhost:4001").replace(/\/+$/, "");

export const getPreviewUrl = (url) => {
  if (!url) return "";
  const clean = String(url).replace(/\\/g, "/");
  if (/^https?:\/\//i.test(clean)) return clean;
  if (clean.startsWith("/uploads")) return `${API_BASE}${clean}`;
  return `${API_BASE}${clean.startsWith("/") ? clean : `/${clean}`}`;
};
