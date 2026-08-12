// Central department helpers for the NCET-style `/department/:id` routes.
// Every department has its own URL slug derived from its banner title, e.g.
// "Masters In Business Administration" -> /department/masters-in-business-administration

/** Normalize a programme title to the mapping key used by the data-export JSONs. */
export const normalizeProgramme = (title: string) =>
  (title || "").toLowerCase().replace(/&/g, "and").trim();

/** "Masters In Business Administration" -> "masters-in-business-administration" */
export const slugifyDept = (title: string) =>
  normalizeProgramme(title)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** "masters-in-business-administration" -> "masters in business administration" */
export const deptSlugToProgramme = (slug: string) => (slug || "").replace(/-/g, " ");

/** Programme name -> banner key in data-export/department-banners. */
export const deptProgrammeToBannerKey = (programme: string): string | undefined => {
  const map: Record<string, string> = {
    science: "Science",
    "commerce and management": "UG_Commerce",
    "computer application": "UG_CA",
    "masters in business administration": "MBA",
    "masters of commerce": "MOC",
    "masters of computer application": "MCA",
    "department of kannada": "DOK",
    "department of hindi": "DOH",
    "department of english": "DOE",
  };
  return map[normalizeProgramme(programme)];
};

/** Nice display title fallback (used when banner content is missing). */
export const formatDeptTitle = (programme: string) => {
  const map: Record<string, string> = {
    "masters in business administration": "Master of Business Administration",
    "masters of commerce": "Master of Commerce",
    "masters of computer application": "Master of Computer Applications",
    science: "Science",
    "commerce and management": "Commerce & Management",
    "computer application": "Computer Applications",
    "department of kannada": "Department of Kannada",
    "department of hindi": "Department of Hindi",
    "department of english": "Department of English",
  };
  return map[normalizeProgramme(programme)] || programme;
};

/** Academic level for the breadcrumb trail (same grouping as the departments directory). */
export const getDeptCategory = (bannerKey: string) => {
  if (["MBA", "MCA", "MOC"].includes(bannerKey)) return { name: "Post-Graduation", param: "pg" };
  if (["UG_Commerce", "UG_CA", "Science"].includes(bannerKey)) return { name: "Under-Graduation", param: "ug" };
  if (["DOK", "DOH", "DOE"].includes(bannerKey)) return { name: "Languages", param: "lang" };
  return { name: "Departments", param: "" };
};

/** Tab ids rendered on the department detail page (route segment values). */
export const DEPARTMENT_TAB_IDS = ["about", "vision", "hod", "faculty", "peo", "syllabus"] as const;

export const isValidDeptTab = (tab?: string): tab is string =>
  !!tab && (DEPARTMENT_TAB_IDS as readonly string[]).includes(tab);

/** Display labels for each tab id (used in breadcrumbs + metadata). */
export const DEPT_TAB_LABELS: Record<string, string> = {
  about: "About Department",
  vision: "Vision & Mission",
  hod: "HOD's Message",
  faculty: "Faculty",
  peo: "PEO's, PO's & PSO's",
  syllabus: "Syllabus",
};

export const deptTabLabel = (tab: string) => DEPT_TAB_LABELS[tab] || tab;
