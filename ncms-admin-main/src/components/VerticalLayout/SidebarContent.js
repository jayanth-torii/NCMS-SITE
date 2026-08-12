import PropTypes from "prop-types"
import React, { useCallback, useEffect, useRef } from "react"

// //Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import withRouter from "components/Common/withRouter"
import { Link } from "react-router-dom"

import { canReadPage } from "../../store/slices/authSlice"

// Data-driven sidebar. Every entry is gated by the logged-in user's READ
// permission for its `key` (via canReadPage). Admins read everything; the
// dashboard is always visible; admin-only pages (site/users/submissions) never
// appear in a non-admin's permission set so they are hidden automatically.
const MENU = [
  { key: "dashboard", to: "/dashboard", icon: "ti-desktop", label: "Dashboard" },

  // ----- Website HEADER order -----
  { key: "home", to: "/home-page", icon: "ti-home", label: "Home Page" },
  { key: "about", to: "/about-ncms", icon: "ti-info", label: "About NCMS" },
  {
    key: "departments",
    icon: "ti-layout-grid2",
    label: "Departments",
    items: [
      { key: "departmentsPage", to: "/departments-page", label: "Departments Page" },
      { key: "departmentBanners", to: "/department-banners", label: "Department Banners" },
      { key: "departmentFaculties", to: "/department-faculties", label: "Department Faculties" },
      { key: "hodContents", to: "/hod-contents", label: "HOD Contents" },
      { key: "programContents", to: "/program-contents", label: "Program Contents" },
      { key: "courseContents", to: "/course-contents", label: "Course Contents" },
      { key: "syllabusContents", to: "/syllabus-contents", label: "Syllabus Contents" },
      { key: "visionMissions", to: "/vision-missions", label: "Vision & Mission" },
    ],
  },
  { key: "placement", to: "/placement", icon: "ti-briefcase", label: "Placement" },
  { key: "studentCenter", to: "/student-center", icon: "ti-user", label: "Student Center" },
  { key: "samashti", to: "/samashti", icon: "ti-book", label: "Samashti" },
  { key: "newsLetter", to: "/news-letter", icon: "ti-write", label: "News Letter" },
  { key: "newsClippings", to: "/news-clippings", icon: "ti-pin", label: "News Clippings" },
  { key: "event", to: "/events", icon: "ti-calendar", label: "Events" },
  { key: "gallery", to: "/gallery", icon: "ti-gallery", label: "Gallery" },
  {
    key: "blog",
    icon: "ti-file",
    label: "Blog",
    items: [
      { key: "blog", to: "/blogs", label: "Blog Posts" },
      { key: "blogBanner", to: "/blog-banner", label: "Blog Banner" },
    ],
  },
  { key: "footer", to: "/footer", icon: "ti-layout", label: "Footer" },
  { key: "contact", to: "/contact-us-page", icon: "ti-email", label: "Contact Us" },
  { key: "applyNow", to: "/apply-now", icon: "ti-clipboard", label: "Apply Now" },

  // ----- Statutory / Cells -----
  {
    key: "cells",
    icon: "ti-shield",
    label: "Cells & Committees",
    items: [
      { key: "antiRagging", to: "/anti-ragging", label: "Anti Ragging" },
      { key: "antiSexualHarassment", to: "/anti-sexual-harassment", label: "Anti Sexual Harassment" },
      { key: "grievanceRedressal", to: "/grievance-redressal", label: "Grievance Redressal" },
      { key: "humanRights", to: "/human-rights", label: "Human Rights" },
      { key: "scAndSt", to: "/sc-and-st", label: "SC & ST" },
      { key: "unityCouncil", to: "/unity-council", label: "Unity Council" },
      { key: "culturalCommittee", to: "/cultural-committee", label: "Cultural Committee" },
      { key: "edCell", to: "/ed-cell", label: "ED Cell" },
    ],
  },
  {
    key: "studentLife",
    icon: "ti-heart",
    label: "Student Life",
    items: [
      { key: "nss", to: "/nss", label: "NSS" },
      { key: "ncc", to: "/ncc", label: "NCC" },
      { key: "commerceForum", to: "/commerce-forum", label: "Commerce Forum" },
      { key: "kalaChaitanya", to: "/kala-chaitanya", label: "Kala Chaitanya" },
      { key: "nptelLocalChapter", to: "/nptel-local-chapter", label: "NPTEL Local Chapter" },
      { key: "pragyanScienceForum", to: "/pragyan-science-forum", label: "Pragyan Science Forum" },
      { key: "researchCell", to: "/research-cell", label: "Research Cell" },
      { key: "sakhiSamrudhi", to: "/sakhi-samrudhi", label: "Sakhi Samrudhi" },
    ],
  },

  // ----- More pages -----
  { key: "auditReport", to: "/audit-report", icon: "ti-file", label: "Audit Report" },
  { key: "iic", to: "/iic", icon: "ti-light-bulb", label: "IIC" },
  { key: "iqac", to: "/iqac", icon: "ti-medall", label: "IQAC" },
  { key: "library", to: "/library", icon: "ti-book", label: "Library" },
  { key: "mandatoryDisclosure", to: "/mandatory-disclosure", icon: "ti-agenda", label: "Mandatory Disclosure" },
  { key: "uucms", to: "/uucms", icon: "ti-desktop", label: "UUCMS" },
  { key: "valueAddedCourse", to: "/value-added-course", icon: "ti-plus", label: "Value Added Course" },

  // ----- Inboxes -----
  { key: "applyNowInbox", to: "/submissions/apply-now", icon: "ti-email", label: "Apply Now Submissions" },
  { key: "contactInbox", to: "/submissions/contact-us", icon: "ti-comments", label: "Contact Submissions" },

  // ----- Admin-only (hidden from non-admins automatically) -----
  { key: "site", to: "/site-settings", icon: "ti-settings", label: "Site Settings" },
  { key: "users", to: "/users", icon: "ti-user", label: "User Management" },
]

const SidebarContent = props => {
  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = process.env.PUBLIC_URL + props.router.location.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    if (!ul) return;
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [props.router.location.pathname, activateParentDropdown]);

  useEffect(() => {
    if (ref.current && ref.current.recalculate) ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  // Logged-in user drives which items are visible.
  let user = null
  try {
    user = JSON.parse(localStorage.getItem("authUser") || "null")?.user || null
  } catch (e) {
    user = null
  }
  const can = (key) => canReadPage(user, key)

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {MENU.map((item, idx) => {
              if (item.items) {
                // Group parents: visible if the user can read ANY child key.
                const visible = item.items.some((sub) => can(sub.key)) || can(item.key);
                if (!visible) return null;
                return (
                  <li key={`${item.key}-${idx}`}>
                    <Link to="/#" className="has-arrow waves-effect">
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </Link>
                    <ul className="sub-menu">
                      {item.items
                        .filter((sub) => can(sub.key))
                        .map((sub) => (
                          <li key={sub.to}>
                            <Link to={sub.to}>{sub.label}</Link>
                          </li>
                        ))}
                    </ul>
                  </li>
                )
              }

              if (!can(item.key)) return null;

              return (
                <li key={`${item.key}-${idx}`}>
                  <Link to={item.to} className="waves-effect">
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
}

export default withRouter(SidebarContent)
