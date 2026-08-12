"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { slugifyDept } from "@/lib/departments";

const EASE = [0.23, 1, 0.32, 1] as const;

/* ------------------------------------------------------------------ icons */
const IconSchool = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 9l-10-4-10 4 10 4 10-4v6" />
    <path d="M6 10.6v5.4a6 3 0 0012 0v-5.4" />
  </svg>
);
const IconCertificate = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="15" r="3" />
    <path d="M13 17.5v4.5l2-1.5 2 1.5v-4.5" />
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 9h10M7 12h3" />
  </svg>
);
const IconFlask = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 3h6M10 9h4M10 3v6L6 20a1 1 0 00.8 1.6h10.4a1 1 0 00.8-1.6l-4-11V3" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3-3" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const IconResearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 3h6v7l5 9H4l5-9V3z" />
    <path d="M9 3h6" />
  </svg>
);
const IconIndustry = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
    <path d="M9 9h1M14 9h1M9 13h1M14 13h1" />
  </svg>
);
const IconInnovation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
  </svg>
);

const CATEGORY_ICONS: Record<string, React.FC> = { school: IconSchool, certificate: IconCertificate, flask: IconFlask };
const PILLAR_ICONS: Record<string, React.FC> = { research: IconResearch, industry: IconIndustry, innovation: IconInnovation };

// NCMS department list is a flat map { MBA, UG_Commerce, ... } keyed by banner key.
// Group into academic levels for the "Browse by Level" sidebar.
const GROUP_DEFS: { id: string; short: string; tag: string; icon: string; keys: string[] }[] = [
  { id: "pg", short: "Post Graduation", tag: "Post-Graduation", icon: "certificate", keys: ["MBA", "MCA", "MOC"] },
  { id: "ug", short: "Under Graduation", tag: "Under-Graduation", icon: "school", keys: ["UG_Commerce", "UG_CA", "Science"] },
  { id: "lang", short: "Languages", tag: "Languages", icon: "flask", keys: ["DOK", "DOH", "DOE"] },
];

const HighlightHeading = ({ text }: { text: string }) => {
  const parts = (text || "").trim().split(" ");
  if (parts.length <= 1) return <>{text}</>;
  const last = parts.pop();
  return <>{parts.join(" ")} <span>{last}</span></>;
};

const DepartmentsDirectory = ({ banners, hero, pillars, showcase }: any) => {
  const [activeTab, setActiveTab] = useState<string>(GROUP_DEFS[0].id);
  const [query, setQuery] = useState("");

  // Build category → items from the banner map.
  const categories = useMemo(() => {
    const out: Record<string, { title: string; short: string; tag: string; icon: string; items: { title: string; code: string }[] }> = {};
    for (const g of GROUP_DEFS) {
      const items = (g.keys || [])
        .map((k) => (banners && banners[k] ? { title: banners[k].title || k, code: k } : null))
        .filter(Boolean) as { title: string; code: string }[];
      out[g.id] = { title: g.short, short: g.short, tag: g.tag, icon: g.icon, items };
    }
    return out;
  }, [banners]);

  const tabKeys = GROUP_DEFS.map((g) => g.id);
  const category = categories[activeTab] || { items: [], title: "", tag: "" };

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return category.items;
    return category.items.filter((item) => item.title.toLowerCase().includes(q) || item.code.toLowerCase().includes(q));
  }, [category.items, query]);

  // Showcase metrics derived from live data.
  const totalDepts = Object.keys(banners || {}).length;
  const pgCount = (GROUP_DEFS[0].keys || []).filter((k) => banners && banners[k]).length;
  const ugCount = (GROUP_DEFS[1].keys || []).filter((k) => banners && banners[k]).length;
  const showcaseImg = showcase?.image || "/images/programme_fd2a6039af.png";
  const showcaseMetrics = [
    { value: String(totalDepts), label: "Departments" },
    { value: String(pgCount), label: "PG Programmes" },
    { value: String(ugCount), label: "UG Programmes" },
  ];

  return (
    <>
      {/* Programme directory */}
      <section className="dptr-directory">
        <div className="container">
          <div className="dptr-directory__inner">
            {/* Category sidebar */}
            <aside className="dptr-cats" aria-label="Programme categories">
              <span className="dptr-cats__label">Browse by Level</span>
              <ul className="dptr-cats__list">
                {tabKeys.map((key) => {
                  const cat = categories[key];
                  if (!cat) return null;
                  const Icon = CATEGORY_ICONS[cat.icon] || IconSchool;
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        className={`dptr-cats__btn${activeTab === key ? " is-active" : ""}`}
                        onClick={() => setActiveTab(key)}
                        aria-pressed={activeTab === key}
                      >
                        <span className="dptr-cats__icon"><Icon /></span>
                        <span className="dptr-cats__text">
                          <span className="dptr-cats__name">{cat.short}</span>
                          <span className="dptr-cats__count">{cat.items.length} programmes</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Main panel */}
            <div className="dptr-panel">
              <div className="dptr-panel__head">
                <div className="dptr-panel__head-row">
                  <div>
                    <h2 className="dptr-panel__title">{category.title}</h2>
                    <p className="dptr-panel__meta">
                      Showing <strong>{filteredItems.length}</strong> of <strong>{category.items.length}</strong> programmes
                    </p>
                  </div>
                  <div className="dptr-search">
                    <span className="dptr-search__icon"><IconSearch /></span>
                    <input
                      type="search"
                      className="dptr-search__input"
                      placeholder="Search programmes…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      aria-label="Search programmes"
                    />
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.ul
                  key={`${activeTab}-${query}`}
                  className="dptr-list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, idx) => (
                      <li key={item.code}>
                        <Link
                          href={`/department/${slugifyDept(item.title)}`}
                          className="dptr-row"
                        >
                          <span className="dptr-row__num">{String(idx + 1).padStart(2, "0")}</span>
                          <span className="dptr-row__body">
                            <span className="dptr-row__title">{item.title}</span>
                            <span className="dptr-row__tag">{item.code} · {category.tag}</span>
                          </span>
                          <span className="dptr-row__action">
                            Explore
                            <IconArrow />
                          </span>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="dptr-empty">
                      <strong>No programmes found</strong>
                      Try a different search term or switch category.
                    </li>
                  )}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars + campus showcase */}
      <section className="dptr-pillars">
        <div className="container">
          <div className="dptr-pillars__intro">
            <h2>{pillars?.heading || "Why Study at NCMS"}</h2>
            <p>{pillars?.description || "Teaching and learning, research and engagement. At NCMS education is rigorous — every aspect is geared to prepare you to improve the world."}</p>
          </div>

          <div className="dptr-pillars__grid">
            {(pillars?.items || [
              { title: "Research", text: "Hands-on research and service-learning under supportive, expert faculty.", icon: "research" },
              { title: "Industry", text: "Industry partnerships and career opportunities designed to shape your future.", icon: "industry" },
              { title: "Innovation", text: "A culture of curiosity that encourages innovation and real-world problem solving.", icon: "innovation" },
            ]).map(({ title, text, icon }: any) => {
              const Icon = PILLAR_ICONS[icon] || IconResearch;
              return (
                <article key={title} className="dptr-pillar">
                  <span className="dptr-pillar__icon"><Icon /></span>
                  <h3 className="dptr-pillar__title">{title}</h3>
                  <p className="dptr-pillar__text">{text}</p>
                </article>
              );
            })}
          </div>

          <div className="dptr-showcase">
            <img src={showcaseImg} alt="NCMS campus and student life" className="dptr-showcase__img" loading="lazy" />
            <div className="dptr-showcase__overlay">
              <div>
                <h3 className="dptr-showcase__heading">
                  <HighlightHeading text={showcase?.title || "Programme That You Are Looking For"} />
                </h3>
                <p className="dptr-showcase__text">{showcase?.description || ""}</p>
              </div>
              <div className="dptr-showcase__metrics">
                {showcaseMetrics.map((m, i) => (
                  <div className="dptr-showcase__metric" key={i}>
                    <strong>{m.value}</strong>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DepartmentsDirectory;
