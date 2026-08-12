<div align="center">

# 👨‍💻 DEVELOPER.md

### Developer Notes & Build Story — **NCMS-SITE**

</div>

---

## 🧑‍💻 Author

| | |
| --- | --- |
| **Name** | **Jayanth** |
| **Email** | jayanth.m@ncetmail.com |
| **Project** | Nagarjuna College of Management Studies — Official Website Platform (NCMS-SITE) |
| **Role** | Full-stack developer — design, frontend, backend, admin panel, data migration & deployment |

---

## 🏗️ What I Did

This section documents everything that was built, redesigned and delivered for the NCMS platform.

### 🎨 UI/UX — Pixel-perfect college website (NCET/NDC design language)
- **Header, Footer & Home** — completely redesigned to match the exact NCET/NDC UI: same fonts, font sizes, spacing, icons, transitions and theme (navy `#0e2455` + orange `#F6872A`).
- **A Glimpse of NCMS** — redesigned from scratch after the original looked off-balance.
- **All main pages** rebuilt in the same design language:
  - **About NCMS** — exactly per the NCET about page.
  - **Blog + Blog Details** — first a premium image-rich redesign, then a faithful port of the **NDC blog design** (number badges, SVG curve overlays, floating icons, pagination, related-articles sidebar, prev/next blog navigation).
  - **IIC & IQAC** — implemented using the **best design from NCET vs NDC** (NCET's richer layouts were chosen): count-up stats, about sections, pillar cards, member grids, document hubs, accreditation hubs, policies, feedback libraries and initiatives lists.
  - **Gallery, Samashti, Departments & department sub-pages** — same NCET banner/image/style treatment; **every department routed** with tabbed content (About · HOD · Vision & Mission · PEOs · Syllabus · Faculty) restyled as premium cards with decorative geometric backgrounds.
  - **Contact Us** — implemented exactly as per the NCET page (no pagination — exact copy).
- **Micro-interactions everywhere** — animated floating icons, pulse rings, image shimmers, count-up stats, scroll reveals, hover lifts, Swiper carousels, and `prefers-reduced-motion` support.

### 🗄️ Data Migration — CMS → JSON + local media
- **Fetched all content** from the CMS and stored it as structured **JSON** (`data-export/*.json`).
- **Downloaded every image and PDF** into the website's `public/` folder so the site runs fully offline.
- **Mapped every single data field** from JSON into the UI — every section, image, PDF and text is rendered.
- **Disconnected the backend dependency** — the site now works standalone (live API optional, JSON fallback always available).

### ⚙️ Backend (Express + MongoDB)
- Full **Express + Mongoose** API mirroring the NCET-style structure.
- **JWT authentication**, role-based access, `multer` uploads, `express-validator`, CORS, dotenv config.
- **Seeding system** — `npm run seed` populates the entire database from JSON; `seedAdmin.js` creates the admin account.

### 🛠️ Admin Panel (React · port 3001)
- **Skote-theme transplant** — Layout/Breadcrumb reducers, `createStore` + thunk + RTK auth slice.
- Rewritten `VerticalLayout` (Sidebar, Header, Footer), `ProfileMenu`, `Rightbar`, `NonAuthLayout`.
- **Login with video background + OTP flow**, Dashboard, ContentEditor, Users, Blogs, Submissions, ChangePassword, Logout, PageNotFound.
- **Tabbed menu with transition animations** — one consistent UI/UX design across every screen (matching the NCET admin design).
- Fixed the `humanize()` crash on null content in the content editor.

### 🐛 Bug Fixes & Polish
- Fixed the "Application error / client-side exception" across all pages.
- Fixed `net::ERR_ABORTED 400` CSS/JS chunk load errors and the `share-modal` null `addEventListener` crash.
- Fixed "Cannot update a component (`DepartmentTabs`) while rendering a different component (`HodMessage`)" React error.
- Fixed **blog images not loading** — verified all 20 images, added `onError` fallback to a known-good hero + shimmer placeholders so a broken image never shows.
- Fixed pagination placement, `" — Report"` label bug in IQAC feedback titles, certificates grid when only one image exists, and orphaned dead components cleanup.
- Logo/theme alignment with the original NCMS branding.

### 📚 Documentation & Deliverables
- **Site map** — generated `NCMS_Website_Site_Map.xlsx` (200–250 target pages; sub-pages marked for later) plus the `NCET_Website_Test_Report_v2.xlsx` analysis.
- **README.md** — full project documentation with architecture diagrams (Mermaid), tech stack, setup guides and **animated SVG loaders**.
- **This file** — developer notes & credits.

---

## 🛠️ Tech Used

| Area | Technologies |
| --- | --- |
| Frontend | Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · SCSS · Mantine · Framer Motion · Swiper · lucide-react |
| Backend | Express 4 · Mongoose 7 · MongoDB · JWT · multer · nodemailer · express-validator |
| Admin | React 18 · Redux Toolkit · reactstrap · Bootstrap 5 · framer-motion · SweetAlert2 |
| Tooling | Node.js ≥ 18 · npm · Git · GitHub |

---

## 🚀 Quick Start

```bash
# 1. Website (Next.js)
cd ncms-web-main && npm install && npm run dev        # :3100

# 2. Backend (Express + MongoDB)
cd ncms-backend-main && npm install && npm run seed && npm run dev   # :4001

# 3. Admin panel (React)
cd ncms-admin-main && npm install && npm start        # :3001
```

---

## 📌 Notes & Conventions

- Design tokens: **navy `#0e2455`** · **orange `#F6872A`** · radius 12–32px · Poppins/system font stack.
- Always run `npx tsc --noEmit` in `ncms-web-main` before committing.
- Media lives in `ncms-web-main/public/`; data fallbacks live in `ncms-web-main/src/data-export/`.
- The Strapi CMS was intentionally **removed** from the repo — the custom Express + MongoDB backend + JSON fallback replaces it.

---

<div align="center">

**— Jayanth · Full-Stack Developer · NCMS-SITE —**

_🚀 Powered by Next.js · Express · MongoDB · React_

</div>
