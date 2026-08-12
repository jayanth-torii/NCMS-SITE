import { getRequest, postRequest } from "./httpServices";
import { API_ROUTES } from "./route";

// Per-page service functions — same convention as the admin panel's
// data.service.ts. Every getter returns the unwrapped page payload
// (`{ success, data: { data: {...} } }` -> `data.data`) or null when the
// backend is unreachable (callers fall back to their static JSON).

async function page(route: string) {
  const res = await getRequest<{ success: boolean; data: { data?: any } }>(route);
  if (!res?.success) return null;
  // The backend stores each page's payload in a single doc's `data` field.
  return res.data?.data ?? null;
}

export const getHome = () => page(API_ROUTES.HOME);
export const getAboutNcms = () => page(API_ROUTES.ABOUT_NCMS);
export const getApplyNow = () => page(API_ROUTES.APPLY_NOW);
export const getAuditReport = () => page(API_ROUTES.AUDIT_REPORT);
export const getBlogBanner = () => page(API_ROUTES.BLOG_BANNER);
export const getBlogs = () => page(API_ROUTES.BLOGS);
export const getContactUsPage = () => page(API_ROUTES.CONTACT_US_PAGE);
export const getDepartmentsPage = () => page(API_ROUTES.DEPARTMENTS_PAGE);
export const getDepartmentBanners = () => page(API_ROUTES.DEPARTMENT_BANNERS);
export const getDepartmentFaculties = () => page(API_ROUTES.DEPARTMENT_FACULTIES);
export const getHodContents = () => page(API_ROUTES.HOD_CONTENTS);
export const getProgramContents = () => page(API_ROUTES.PROGRAM_CONTENTS);
export const getCourseContents = () => page(API_ROUTES.COURSE_CONTENTS);
export const getSyllabusContents = () => page(API_ROUTES.SYLLABUS_CONTENTS);
export const getVisionMissions = () => page(API_ROUTES.VISION_MISSIONS);
export const getEvents = () => page(API_ROUTES.EVENT);
export const getFooter = () => page(API_ROUTES.FOOTER);
export const getGallery = () => page(API_ROUTES.GALLERY);
export const getIic = () => page(API_ROUTES.IIC);
export const getIqac = () => page(API_ROUTES.IQAC);
export const getLibrary = () => page(API_ROUTES.LIBRARY);
export const getMandatoryDisclosure = () => page(API_ROUTES.MANDATORY_DISCLOSURE);
export const getNewsClippings = () => page(API_ROUTES.NEWS_CLIPPINGS);
export const getNewsLetter = () => page(API_ROUTES.NEWS_LETTER);
export const getPlacement = () => page(API_ROUTES.PLACEMENT);
export const getSamashti = () => page(API_ROUTES.SAMASHTI);
export const getStudentCenter = () => page(API_ROUTES.STUDENT_CENTER);
export const getUucms = () => page(API_ROUTES.UUCMS);
export const getValueAddedCourse = () => page(API_ROUTES.VALUE_ADDED_COURSE);
export const getAntiRagging = () => page(API_ROUTES.ANTI_RAGGING);
export const getAntiSexualHarassment = () => page(API_ROUTES.ANTI_SEXUAL_HARASSMENT);
export const getGrievanceRedressal = () => page(API_ROUTES.GRIEVANCE_REDRESSAL);
export const getHumanRights = () => page(API_ROUTES.HUMAN_RIGHTS);
export const getScAndSt = () => page(API_ROUTES.SC_AND_ST);
export const getNss = () => page(API_ROUTES.NSS);
export const getNcc = () => page(API_ROUTES.NCC);
export const getEdCell = () => page(API_ROUTES.ED_CELL);
export const getCulturalCommittee = () => page(API_ROUTES.CULTURAL_COMMITTEE);
export const getCommerceForum = () => page(API_ROUTES.COMMERCE_FORUM);
export const getKalaChaitanya = () => page(API_ROUTES.KALA_CHAITANYA);
export const getNptelLocalChapter = () => page(API_ROUTES.NPTEL_LOCAL_CHAPTER);
export const getPragyanScienceForum = () => page(API_ROUTES.PRAGYAN_SCIENCE_FORUM);
export const getResearchCell = () => page(API_ROUTES.RESEARCH_CELL);
export const getSakhiSamrudhi = () => page(API_ROUTES.SAKHI_SAMRUDHI);
export const getUnityCouncil = () => page(API_ROUTES.UNITY_COUNCIL);

// Public form submissions (same payloads the site already posts)
export const postApplyNowForm = (data: any) => postRequest("/apply-now-forms", data);
export const postContactUsForm = (data: any) => postRequest("/contact-us-forms", data);
