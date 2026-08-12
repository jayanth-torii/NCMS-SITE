import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiInbox,
  FiFileText,
  FiUsers,
  FiGrid,
  FiMessageSquare,
  FiArrowRight,
  FiHome,
  FiPieChart,
  FiImage,
  FiBookOpen,
  FiAward,
  FiBriefcase,
} from "react-icons/fi";
import { setBreadcrumbItems } from "../../store/actions";
import { getBlogs, getUsers, getApplyNowForms, getContactUsForms } from "../../services/data.service";
import { ADMIN_PAGES } from "../../config/adminPages";

const C = { ink: "#1e1b4b", muted: "#6b7192", soft: "#8890b0", line: "#e9ebf6" };
const PALETTE = ["#4f46e5", "#d97706", "#059669", "#e11d48", "#0891b2", "#7c3aed"];

const Card = ({ children, style, className }) => (
  <div
    className={className}
    style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, boxShadow: "0 1px 2px rgba(30,27,75,.05)", ...style }}
  >
    {children}
  </div>
);

const SectionTitle = ({ children, sub, right }) => (
  <div className="d-flex justify-content-between align-items-start" style={{ marginBottom: "1.1rem", gap: "1rem" }}>
    <div>
      <h6 style={{ fontWeight: 800, color: C.ink, margin: 0, letterSpacing: "-.01em" }}>{children}</h6>
      {sub && <p style={{ color: C.muted, fontSize: ".82rem", margin: ".2rem 0 0" }}>{sub}</p>}
    </div>
    {right}
  </div>
);

const Dashboard = (props) => {
  document.title = "NCMS Admin — Dashboard";
  const [stats, setStats] = useState({
    blogs: 0,
    users: 0,
    applyNow: 0,
    contact: 0,
  });

  useEffect(() => {
    props.setBreadcrumbItems("Dashboard", [
      { title: "Dashboard", link: "/dashboard" },
    ]);
  }, [props]);

  useEffect(() => {
    let active = true;
    const safe = async (fn) => {
      try {
        return await fn();
      } catch {
        return null;
      }
    };
    (async () => {
      const [blogs, users, applyNow, contact] = await Promise.all([
        safe(getBlogs),
        safe(getUsers),
        safe(getApplyNowForms),
        safe(getContactUsForms),
      ]);
      if (!active) return;
      const len = (r) => (Array.isArray(r) ? r.length : Array.isArray(r?.data) ? r.data.length : 0);
      setStats({
        blogs: len(blogs),
        users: len(users),
        applyNow: len(applyNow),
        contact: len(contact),
      });
    })();
    return () => {
      active = false;
    };
  }, []);

  const contentAreas = ADMIN_PAGES.filter((p) => !["dashboard", "applyNowInbox", "contactInbox", "site", "users"].includes(p.key)).length;

  const metrics = [
    { label: "Content Areas", value: contentAreas, color: PALETTE[0], icon: FiGrid, to: "/home-page" },
    { label: "Blog Posts", value: stats.blogs, color: PALETTE[1], icon: FiFileText, to: "/blogs" },
    { label: "Apply Now Submissions", value: stats.applyNow, color: PALETTE[2], icon: FiInbox, to: "/submissions/apply-now" },
    { label: "Contact Queries", value: stats.contact, color: PALETTE[3], icon: FiMessageSquare, to: "/submissions/contact-us" },
    { label: "Admin Users", value: stats.users, color: PALETTE[4], icon: FiUsers, to: "/users" },
  ];

  const QUICK_LINKS = [
    { label: "Home Page", to: "/home-page", icon: FiHome, color: "#9333ea" },
    { label: "Blogs & News", to: "/blogs", icon: FiBookOpen, color: "#059669" },
    { label: "Departments", to: "/departments", icon: FiGrid, color: "#7c3aed" },
    { label: "Placements", to: "/placements", icon: FiAward, color: "#e11d48" },
    { label: "IQAC", to: "/iqac", icon: FiPieChart, color: "#0d9488" },
    { label: "Gallery", to: "/gallery", icon: FiImage, color: "#db2777" },
    { label: "Student Center", to: "/student-center", icon: FiUsers, color: "#4f46e5" },
    { label: "Careers", to: "/careers", icon: FiBriefcase, color: "#d97706" },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", paddingBottom: "3rem" }}>
      <div className="row g-4">
        {metrics.map((m, i) => (
          <div className="col-xl-3 col-md-6" key={m.label}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <Card style={{ padding: "1.2rem" }}>
                <Link to={m.to} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: `${m.color}18`,
                        color: m.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: "0 0 auto",
                      }}
                    >
                      <m.icon size={22} />
                    </div>
                    <div style={{ marginLeft: 12, flex: 1 }}>
                      <h5 className="mb-0" style={{ fontWeight: 800, color: C.ink, fontSize: "1.35rem" }}>{m.value}</h5>
                      <p style={{ color: C.muted, margin: 0, fontSize: ".8rem" }}>{m.label}</p>
                    </div>
                    <FiArrowRight size={15} style={{ color: C.soft }} />
                  </div>
                </Link>
              </Card>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="row g-4" style={{ marginTop: ".5rem" }}>
        <div className="col-lg-4">
          <Card style={{ padding: "1.4rem" }}>
            <SectionTitle sub="Jump straight into a content area">Quick Links</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {QUICK_LINKS.map((q) => (
                <Link
                  key={q.label}
                  to={q.to}
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <div
                    className="d-flex align-items-center gap-3"
                    style={{
                      padding: ".65rem .8rem",
                      borderRadius: 12,
                      border: `1px solid ${C.line}`,
                      transition: "background .15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f6f7fb")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                  >
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        background: `${q.color}18`,
                        color: q.color,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: "0 0 auto",
                      }}
                    >
                      <q.icon size={15} />
                    </span>
                    <span style={{ fontWeight: 600, color: C.ink, fontSize: ".88rem", flex: 1 }}>{q.label}</span>
                    <FiArrowRight size={14} style={{ color: C.soft }} />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
        <div className="col-lg-8">
          <Card style={{ padding: "1.4rem" }}>
            <SectionTitle sub="All content areas you can edit from the admin panel">Content Areas</SectionTitle>
            <div className="row g-2">
              {ADMIN_PAGES.filter((p) => !["dashboard", "applyNowInbox", "contactInbox", "site", "users"].includes(p.key)).map((p) => (
                <div className="col-6 col-md-4" key={p.key}>
                  <Link
                    to={p.path}
                    className="d-flex align-items-center justify-content-between p-2 rounded"
                    style={{ border: `1px solid ${C.line}`, color: "#495057", fontSize: ".85rem", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f6f7fb")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                  >
                    <span>{p.label}</span>
                    <FiArrowRight size={13} style={{ color: C.soft }} />
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { setBreadcrumbItems })(Dashboard);
