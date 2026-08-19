// Canonical list of admin pages that role-based permissions are granted on.
// Every content area maps to the generic content editor (`/page/:title/:route`),
// which loads + saves the singleton payload via the backend API route.
import { API_ROUTES } from "../services/route";

export const ADMIN_PAGES = [
  { key: "dashboard", label: "Dashboard", path: "/dashboard" },
  { key: "home", label: "Home Page", path: "/home-page" },
  { key: "about", label: "About NCMS", path: "/about-ncms" },
  { key: "departmentsPage", label: "Departments (overview)", path: "/departments-page" },
  { key: "departmentDetailsEditor", label: "Department Details Editor", path: "/department-details-editor" },
  { key: "departmentBanners", label: "Department Banners", path: "/department-banners" },
  { key: "departmentFaculties", label: "Department Faculties", path: "/department-faculties" },
  { key: "hodContents", label: "HOD Contents", path: "/hod-contents" },
  { key: "programContents", label: "Program Contents", path: "/program-contents" },
  { key: "courseContents", label: "Course Contents", path: "/course-contents" },
  { key: "syllabusContents", label: "Syllabus Contents", path: "/syllabus-contents" },
  { key: "visionMissions", label: "Vision & Mission", path: "/vision-missions" },
  { key: "placement", label: "Placement", path: "/placement" },
  { key: "studentCenter", label: "Student Center", path: "/student-center" },
  { key: "samashti", label: "Samashti", path: "/samashti" },
  { key: "newsLetter", label: "News Letter", path: "/news-letter" },
  { key: "newsClippings", label: "News Clippings", path: "/news-clippings" },
  { key: "event", label: "Events", path: "/events" },
  { key: "gallery", label: "Gallery", path: "/gallery" },
  { key: "blog", label: "Blog", path: "/blogs" },
  { key: "blogBanner", label: "Blog Banner", path: "/blog-banner" },
  { key: "footer", label: "Footer", path: "/footer" },
  { key: "contact", label: "Contact Us", path: "/contact-us-page" },
  { key: "applyNow", label: "Apply Now", path: "/apply-now" },
  { key: "auditReport", label: "Audit Report", path: "/audit-report" },
  { key: "iic", label: "IIC", path: "/iic" },
  { key: "iqac", label: "IQAC", path: "/iqac" },
  { key: "library", label: "Library", path: "/library" },
  { key: "mandatoryDisclosure", label: "Mandatory Disclosure", path: "/mandatory-disclosure" },
  { key: "uucms", label: "UUCMS", path: "/uucms" },
  { key: "valueAddedCourse", label: "Value Added Programs", path: "/value-added-course" },
  { key: "antiRagging", label: "Anti Ragging Cell", path: "/anti-ragging" },
  { key: "antiSexualHarassment", label: "Anti Sexual Harassment Cell", path: "/anti-sexual-harassment" },
  { key: "grievanceRedressal", label: "Grievance Redressal Cell", path: "/grievance-redressal" },
  { key: "humanRights", label: "Human Rights Cell", path: "/human-rights" },
  { key: "scAndSt", label: "SC/ST & OBC Cell", path: "/sc-and-st" },
  { key: "nss", label: "NSS", path: "/nss" },
  { key: "ncc", label: "NCC", path: "/ncc" },
  { key: "edCell", label: "ED Cell", path: "/ed-cell" },
  { key: "culturalCommittee", label: "Cultural Committee", path: "/cultural-committee" },
  { key: "commerceForum", label: "Commerce Forum", path: "/commerce-forum" },
  { key: "kalaChaitanya", label: "Kala Chaitanya", path: "/kala-chaitanya" },
  { key: "nptelLocalChapter", label: "NPTEL Local Chapter", path: "/nptel-local-chapter" },
  { key: "pragyanScienceForum", label: "Pragyan Science Forum", path: "/pragyan-science-forum" },
  { key: "researchCell", label: "Research Cell", path: "/research-cell" },
  { key: "sakhiSamrudhi", label: "Sakhi Samrudhi- Women Empowerment Cell", path: "/sakhi-samrudhi" },
  { key: "unityCouncil", label: "Unity Council - Equal Opportunity Cell", path: "/unity-council" },
  { key: "applyNowInbox", label: "Apply Now Submissions", path: "/submissions/apply-now" },
  { key: "contactInbox", label: "Contact Submissions", path: "/submissions/contact-us" },
  { key: "site", label: "Site Settings", path: "/site-settings", adminOnly: true },
  { key: "users", label: "User Management", path: "/users", adminOnly: true },
];

// Pages an admin can hand out to other roles (everything except admin-only ones).
export const GRANTABLE_PAGES = ADMIN_PAGES.filter((p) => !p.adminOnly);

export const ROLES = ["admin", "coo", "dean", "principal", "hod", "faculty"];

export const ROLE_LABELS = {
  admin: "Admin (full access)",
  coo: "COO (read only)",
  dean: "Dean",
  principal: "Principal",
  hod: "HOD (department scoped)",
  faculty: "Faculty (read only)",
};

export const DEPARTMENT_SCOPED_ROLES = ["hod", "faculty"];

export const PAGE_BY_KEY = ADMIN_PAGES.reduce((acc, p) => {
  acc[p.key] = p;
  return acc;
}, {});

export const pageKeyForPath = (path) => {
  const hit = ADMIN_PAGES.find((p) => p.path === path);
  return hit ? hit.key : null;
};

export const rolePreset = (role) => {
  return GRANTABLE_PAGES.map((p) => {
    switch (role) {
      case "admin":
      case "principal":
      case "dean":
        return { page: p.key, read: true, write: true };
      case "hod":
        return { page: p.key, read: p.key === "departmentsPage", write: p.key === "departmentsPage" };
      case "coo":
        return { page: p.key, read: true, write: false };
      case "faculty":
      default:
        return { page: p.key, read: false, write: false };
    }
  });
};

// Map admin page key -> backend API route (used by the generic editor).

export const PAGE_ROUTE_BY_KEY = {
  home: API_ROUTES.HOME,
  about: API_ROUTES.ABOUT_NCMS,
  departmentsPage: API_ROUTES.DEPARTMENTS_PAGE,
  departmentBanners: API_ROUTES.DEPARTMENT_BANNERS,
  departmentFaculties: API_ROUTES.DEPARTMENT_FACULTIES,
  hodContents: API_ROUTES.HOD_CONTENTS,
  programContents: API_ROUTES.PROGRAM_CONTENTS,
  courseContents: API_ROUTES.COURSE_CONTENTS,
  syllabusContents: API_ROUTES.SYLLABUS_CONTENTS,
  visionMissions: API_ROUTES.VISION_MISSIONS,
  placement: API_ROUTES.PLACEMENT,
  studentCenter: API_ROUTES.STUDENT_CENTER,
  samashti: API_ROUTES.SAMASHTI,
  newsLetter: API_ROUTES.NEWS_LETTER,
  newsClippings: API_ROUTES.NEWS_CLIPPINGS,
  event: API_ROUTES.EVENT,
  gallery: API_ROUTES.GALLERY,
  blogBanner: API_ROUTES.BLOG_BANNER,
  footer: API_ROUTES.FOOTER,
  contact: API_ROUTES.CONTACT_US_PAGE,
  applyNow: API_ROUTES.APPLY_NOW,
  auditReport: API_ROUTES.AUDIT_REPORT,
  iic: API_ROUTES.IIC,
  iqac: API_ROUTES.IQAC,
  library: API_ROUTES.LIBRARY,
  mandatoryDisclosure: API_ROUTES.MANDATORY_DISCLOSURE,
  uucms: API_ROUTES.UUCMS,
  valueAddedCourse: API_ROUTES.VALUE_ADDED_COURSE,
  antiRagging: API_ROUTES.ANTI_RAGGING,
  antiSexualHarassment: API_ROUTES.ANTI_SEXUAL_HARASSMENT,
  grievanceRedressal: API_ROUTES.GRIEVANCE_REDRESSAL,
  humanRights: API_ROUTES.HUMAN_RIGHTS,
  scAndSt: API_ROUTES.SC_AND_ST,
  nss: API_ROUTES.NSS,
  ncc: API_ROUTES.NCC,
  edCell: API_ROUTES.ED_CELL,
  culturalCommittee: API_ROUTES.CULTURAL_COMMITTEE,
  commerceForum: API_ROUTES.COMMERCE_FORUM,
  kalaChaitanya: API_ROUTES.KALA_CHAITANYA,
  nptelLocalChapter: API_ROUTES.NPTEL_LOCAL_CHAPTER,
  pragyanScienceForum: API_ROUTES.PRAGYAN_SCIENCE_FORUM,
  researchCell: API_ROUTES.RESEARCH_CELL,
  sakhiSamrudhi: API_ROUTES.SAKHI_SAMRUDHI,
  unityCouncil: API_ROUTES.UNITY_COUNCIL,
};
