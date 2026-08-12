// Decorative blog metadata helpers.
//
// The CMS export only carries `id / title / description / content / image`,
// while the NCET blog design renders category chips, dates, read-times and an
// author. We derive stable values so the exact NCET UI can render without
// inventing content that changes on every reload.

export type BlogItem = {
  id: number | string;
  title: string;
  description?: string;
  content?: string;
  image?: string;
  category?: string;
  date?: string;
  readTime?: string;
  author?: string;
  excerpt?: string;
  [key: string]: any;
};

const CATEGORIES = [
  "Campus Life",
  "Academics",
  "Events",
  "Achievements",
  "Community",
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "4 min read" derived from the article word count. */
export function blogReadTime(content?: string): string {
  if (!content) return "3 min read";
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

/** Stable, deterministic date derived from the blog id (fallback). */
export function blogDate(id: number | string, createdAt?: string): string {
  if (createdAt) {
    const d = new Date(createdAt);
    if (!isNaN(d.getTime())) {
      return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
  }
  const n =
    typeof id === "number" ? id : parseInt(String(id), 10) || 1;
  const base = Date.UTC(2025, 0, 1);
  const day = ((n - 1) * 13) % 365;
  const d = new Date(base + day * 86400000);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** Deterministic category chip derived from the blog id. */
export function blogCategory(id: number | string): string {
  const n =
    typeof id === "number" ? id : parseInt(String(id), 10) || 1;
  return CATEGORIES[(n - 1) % CATEGORIES.length];
}

export const BLOG_AUTHOR = "NCMS Editorial Team";

/** Decorate a raw CMS blog doc with every field the NCET design renders. */
export function decorateBlog(b: BlogItem): BlogItem {
  return {
    ...b,
    category: b.category || blogCategory(b.id),
    date: b.date || blogDate(b.id, b.createdAt),
    readTime: b.readTime || blogReadTime(b.content),
    author: b.author || BLOG_AUTHOR,
    excerpt: b.excerpt || b.description || "",
  };
}
