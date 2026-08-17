# 🧠 NCMS Project — Session Memory

> **Purpose:** This file captures the complete state of the NCMS portal project so any future session can resume seamlessly without re-discovery. Read this FIRST, then use the reference projects and data-export folders for detail.

---

## 1. Quick Status (as of Aug 12, 2026)

| Item | State |
|---|---|
| **Repo** | `NCMS-SITE` → `https://github.com/jayanth-torii/NCMS-SITE.git` |
| **Branch** | `main` (tracks `origin/main`) |
| **Commit** | `b945d40` "Initial commit" — **fully pushed, HEAD == origin/main** ✅ |
| **Committed** | `ncms-web-main` (3006 files) · `ncms-admin-main` (205) · `ncms-backend-main` (161) · `ncms-web-main/public/assets/` · `README.md` · `DEVELOPER.md` |
| **Excluded from git** | `ncms-cms-main` (Strapi CMS — user said **don't add Strapi**), `node_modules`, `.env*`, `*.xlsx`, `ncms-web-main/exit` |
| **Web server** | Next.js dev on **`http://localhost:3100`** (keep running — do NOT kill) |
| **Admin server** | React dev on **`http://localhost:3001`** |
| **Backend** | `ncms-backend-main` (Node/Express) |
| **Last verified** | `/blog/2` blog detail page renders perfectly (header, article, Related Articles sidebar, scroll-top button) |

---

## 2. Project Architecture (3 apps + excluded CMS)

```
C:\ncms-new\
├── ncms-web-main/     → Next.js 14+ FRONTEND (App Router, TS) — the public site
├── ncms-backend-main/ → Node backend API
├── ncms-admin-main/   → React admin panel (Skote theme) — manages content
├── ncms-cms-main/     → ⚠️ Strapi CMS — EXCLUDED from git per user request (only used to pull data)
├── data-export/       → (inside ncms-web-main) JSON dumps of ALL CMS data
├── ncms-web-main/public/assets/            → animated SVG loaders for README
├── README.md          → beautiful animated readme
└── DEVELOPER.md       → credits Jayanth + what was done
```

### Reference projects (for exact UI cloning — READ THESE)
- **`C:\ncet-new`** → NCET site (admin + frontend + backend). Primary design reference.
- **`C:\ndc-new`** → NDC site (`ndc-web-main`, `ndc-admin-main`, `ndc-backend-main`). Secondary design reference.
- **Rule:** User wants UI/UX *exactly* as NCET/NDC (theme, styles, icons, animations, transitions, layout) but with **NCMS content**. When in doubt, match NCET.

---

## 3. Frontend (ncms-web-main) — Current State

### How data works (KEY CONVENTION)
- **All content is static JSON** in `ncms-web-main/data-export/<slug>/data.json` (dumped from the old Strapi CMS).
- **No backend dependency** — web runs fully standalone. Pages `import` or `require` from `data-export/`.
- **All images/PDFs** downloaded into `ncms-web-main/public/` (e.g. `/images/...`, `/uploads/...`). Paths inside JSON point at `/uploads/...` which resolve to `public/uploads/...`.
- Media-report: `data-export/_media-report.json`; extraction report: `data-export/_extraction-report.json`.

### Routes implemented (App Router — all `page.tsx`)
- `/` (home) · `/about-ncms` · `/contact-us` · `/apply-now` · `/gallery`
- `/blog` · `/blog/[id]` (blog detail — **verified rendering, screenshotted**)
- `/departments` · `/department` · `/department/[id]` · `/department/[id]/[tab]` (About / HOD / PEOs / Syllabus tabs)
- `/iic` · `/iqac` (NCET designs, count-up stats, doc hubs)
- `/samashti` · `/placements` · `/events` · `/news-clippings` · `/news-letter` · `/uucms`
- `/audit-reports` · `/mandatory-disclosure`
- `/student-center` + **17 subpages** (academic-enrichment: commerce-forum, ed-cell, library, nptel-local-chapter, pragyan-science-forum, research-cell, value-added-programs · community-services: cultural-committee, kala-chaitanya, ncc, nss, sakhi-samrudhi · statutory-cells: anti-ragging, anti-sexual-harassment, grievance-redressal, human-rights, sc-st-obc, unity-council)

### Design system (NCET port)
- Ported SCSS lives in **`ncms-web-main/src/styles/ncet/`** (main.scss, pages/_iqac.scss, blogAnimations.css, etc.) — byte-identical class names to NCET's CSS.
- **Shared components:** `PageBanner` (used by every page), `Header.tsx` + `MenuItems.tsx` (compact unified header, logo badge cross-fade, drawer, WhatsApp CTA), `Footer.tsx` (footerModern, contact cards, link-column popovers), `Preloader`, `ScrollTop`.
- **Blog specifics:** `src/components/BlogsPage/` (ArticleCard, BlogCard, BlogNavigation, Pagination, blogImg.ts fallback helper, blogMeta.ts), animated icons (blg-icon-float, blg-pulse-ring, blg-nudge, blg-img-shimmer in `src/styles/ncet/blogAnimations.css`), image `onError` fallback.
- **IIC/IQAC:** animated count-up stats (framer-motion `useTransform` + `animate`), Swiper carousels for members, tabbed document hubs, accreditation rail+stage.
- **Colors:** NCMS navy + orange (`#F6872A`-ish) accent; body ~off-white with faint dotted grid (per screenshot).
- **Header nav:** Home · About NCMS ▾ · Academics ▾ · Students ▾ · News & Media ▾ · Contact Us + green **Get Help** (WhatsApp) button. Logos: NAGARJUNA COLLEGE OF MANAGEMENT STUDIES + circular seal.

### Todo/deferred
- Some routes may still need the "NCET premium" polish pass; user reviews page-by-page (they iterated: gallery → samashti → departments → blog → iic/iqac).
- ~200–250 pages on the master sitemap (`NCMS_Website_Site_Map.xlsx`); user said subpage mentions → build as pages later.
- S3 storage deferred — local `/public` only.

---

## 4. Admin (ncms-admin-main) — Skote Theme
- React (CRA, port 3001), **Skote admin theme** transplanted: Layout + Breadcrumb reducers, `store/index.js` (createStore + thunk + RTK auth slice), VerticalLayout (Sidebar/SidebarContent/Header/Footer), CommonForBoth (ProfileMenu/Avatar3D/Rightbar), NonAuthLayout, Login.jsx (video bg, OTP flow), Dashboard, ContentEditor, editorLayout, Users, Blogs, Submissions, PageNotFound, ChangePassword, Logout.
- Login: `admin@ncms.co.in` / `admin123` (used previously for verification).
- Video: `ncms-admin-main/public/Ncms_video.mp4`.

## 5. Backend (ncms-backend-main)
- Node backend. Contains `.env` — **NEVER commit** (root `.gitignore` covers `.env*`).

---

## 6. Git & Push History (learn from this!)
- Push of ~3,381 files (~200MB media) over HTTPS is slow and **interrupted pushes hang/fail with `pack-objects died of signal 15` / RPC errors**.
- **Working recipe:** `git config http.version HTTP/1.1 && git config http.postBuffer 1572864000` then push with a LONG timeout (600s+), run in foreground with `--progress`, and DO NOT interrupt.
- Last push (with HTTP/1.1 config) **succeeded** → origin/main == b945d40.
- Lock-file gotcha: a killed `git add` can leave `.git/index.lock` — remove `rm -f .git/index.lock` and re-stage.

## 7. Commands
```bash
# Web (frontend) — keep running
cd /c/ncms-new/ncms-web-main && npm run dev   # → http://localhost:3100

# Admin
cd /c/ncms-new/ncms-admin-main && npm start   # → http://localhost:3001

# Typecheck web
cd /c/ncms-new/ncms-web-main && npx tsc --noEmit

# Verify a route
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3100/<route>
```
- Shell is **bash on Windows** (POSIX syntax; forward-slash paths).

---

## 8. User Preferences (IMPORTANT)
- **Exact UI clone of NCET/NDC** — "I need exact theme, exact page, exact style, exact icon exactly as it is. Content should change." Animations, transitions, 3D loaders, micro-interactions all wanted.
- **Content is NCMS-specific** (Nagarjuna College of Management Studies) — never copy NCET/NDC text.
- Do **not** add Strapi to the repo/README. Do **not** kill the running dev server.
- User moves fast — prefer parallel agents, short verification loops, minimal back-and-forth.
- Report cards/screens side-by-side for review; user gives visual feedback per page.
