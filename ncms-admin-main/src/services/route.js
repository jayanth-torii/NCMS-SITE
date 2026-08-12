// Centralized API routes for the admin. Every content area is a singleton:
//   GET /api/<route>   -> { success, data: { data: {...} } }
//   PUT /api/<route>   -> { success, data }  (upserts the single doc)
// Auth routes:
//   POST /api/login-user   -> { preAuthToken, otp, user }
//   POST /api/login-verify -> { token, user }
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/login-user",
    LOGIN_VERIFY: "/api/login-verify",
    UPDATE_PASSWORD: "/api/update-password",
    ME: "/api/me",
  },
  // User management (admin-only; append /:id for GET one / PUT / DELETE)
  USERS: { GET: "/api/users", ADD: "/api/users", BASE: "/api/users" },
  // Blog posts (collection; append /:postId for GET one / PUT / DELETE)
  BLOGS: { GET: "/api/blogs", ADD: "/api/blogs", BASE: "/api/blogs" },
  // Public form submissions (admin-facing inbox)
  APPLY_NOW_FORMS: { GET: "/api/apply-now-forms", BASE: "/api/apply-now-forms" },
  CONTACT_US_FORMS: { GET: "/api/contact-us-forms", BASE: "/api/contact-us-forms" },
  // File upload
  UPLOAD: "/api/upload",

  // ---- 44 content singletons ----
  ABOUT_NCMS: "/api/about-ncms",
  ANTI_RAGGING: "/api/anti-ragging",
  ANTI_SEXUAL_HARASSMENT: "/api/anti-sexual-harassment",
  APPLY_NOW: "/api/apply-now",
  AUDIT_REPORT: "/api/audit-report",
  BLOG_BANNER: "/api/blog-banner",
  COMMERCE_FORUM: "/api/commerce-forum",
  CONTACT_US_PAGE: "/api/contact-us-page",
  COURSE_CONTENTS: "/api/course-contents",
  CULTURAL_COMMITTEE: "/api/cultural-committee",
  DEPARTMENT_BANNERS: "/api/department-banners",
  DEPARTMENT_FACULTIES: "/api/department-faculties",
  DEPARTMENTS_PAGE: "/api/departments-page",
  ED_CELL: "/api/ed-cell",
  EVENT: "/api/events",
  FOOTER: "/api/footer",
  GALLERY: "/api/gallery",
  GRIEVANCE_REDRESSAL: "/api/grievance-redressal",
  HOD_CONTENTS: "/api/hod-contents",
  HOME: "/api/home",
  HUMAN_RIGHTS: "/api/human-rights",
  IIC: "/api/iic",
  IQAC: "/api/iqac",
  KALA_CHAITANYA: "/api/kala-chaitanya",
  LIBRARY: "/api/library",
  MANDATORY_DISCLOSURE: "/api/mandatory-disclosure",
  NCC: "/api/ncc",
  NEWS_CLIPPINGS: "/api/news-clippings",
  NEWS_LETTER: "/api/news-letter",
  NPTEL_LOCAL_CHAPTER: "/api/nptel-local-chapter",
  NSS: "/api/nss",
  PLACEMENT: "/api/placement",
  PRAGYAN_SCIENCE_FORUM: "/api/pragyan-science-forum",
  PROGRAM_CONTENTS: "/api/program-contents",
  RESEARCH_CELL: "/api/research-cell",
  SAKHI_SAMRUDHI: "/api/sakhi-samrudhi",
  SAMASHTI: "/api/samashti",
  SC_AND_ST: "/api/sc-and-st",
  STUDENT_CENTER: "/api/student-center",
  SYLLABUS_CONTENTS: "/api/syllabus-contents",
  UNITY_COUNCIL: "/api/unity-council",
  UUCMS: "/api/uucms",
  VALUE_ADDED_COURSE: "/api/value-added-course",
  VISION_MISSIONS: "/api/vision-missions",
};
