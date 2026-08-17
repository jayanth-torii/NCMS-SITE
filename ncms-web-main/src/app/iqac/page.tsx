"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";

import PageBanner from "@/components/PageBanner/PageBanner";
import highlight from "@/components/HomeNCET/highlight";
import { Scale, Cog, GraduationCap, LayoutGrid, ShieldCheck, FolderOpen } from "lucide-react";

import IQACDataJson from "@/data-export/iqac/data.json";
import { getIqac } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

/* Per-pillar icon map (matches the tag slug: policy / function / academic / general) */
const PILLAR_ICONS: Record<string, React.ReactNode> = {
  policy: <Scale size={26} strokeWidth={2} />,
  function: <Cog size={26} strokeWidth={2} />,
  academic: <GraduationCap size={26} strokeWidth={2} />,
  general: <LayoutGrid size={26} strokeWidth={2} />,
};

/* ------------------------------------------------------------------ */
/*  Shared motion primitives (same as NCET)                             */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const reveal = {
  variants: fadeUp,
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, amount: 0.12 },
} as const;

/* Animated count-up for the credibility stats band */
const CountUp = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [val, setVal] = useState(0);

  useEffect(() => rounded.on("change", (v) => setVal(v)), [rounded]);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration: 1.4, ease: "easeOut" });
    return controls.stop;
  }, [inView, to, mv]);

  return (
    <span ref={ref}>
      {val}
      {suffix && <span>{suffix}</span>}
    </span>
  );
};

/* Fullscreen decorative background — shades + geometric shapes (same system as department pages) */
const IqacDecor = () => (
  <div className="dept-page-decor" aria-hidden="true">
    <div className="dept-page-gradient"></div>
    <div className="dept-page-dots"></div>
    <div className="dept-pane-glow dept-pane-glow-orange"></div>
    <div className="dept-pane-glow dept-pane-glow-blue"></div>
    <div className="dept-pane-glow dept-pane-glow-navy"></div>
    <div className="dept-pane-shape dept-pane-circle"></div>
    <div className="dept-pane-shape dept-pane-ring"></div>
    <div className="dept-pane-shape dept-pane-triangle"></div>
    <div className="dept-pane-shape dept-pane-diamond"></div>
    <div className="dept-pane-shape dept-pane-diamond-blue"></div>
    <div className="dept-pane-shape dept-pane-plus"></div>
    <div className="dept-pane-shape dept-pane-plus-blue"></div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Doc icons + rows (NCET)                                             */
/* ------------------------------------------------------------------ */
const PdfDocIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

/* local asset paths are already absolute (/pdfs/..., /images/...) */
const media = (p?: string | null) => p || "";

/* Only append a column header as a year label when it is actually a year (YYYY-YYYY) */
const yearLabel = (y?: string) => (y && /^\d{4}\s*[-–]\s*\d{4}$/.test(y) ? ` — ${y}` : "");

const IqacDocRow = ({ doc }: { doc: { title?: string; file?: string | null; link?: string | null } }) => (
  <a href={media(doc.file || doc.link)} target="_blank" rel="noreferrer" className="iqac-file-item">
    <span className="iqac-file-item__icon">
      <PdfDocIcon />
    </span>
    <span className="iqac-file-item__title">{doc.title}</span>
    <span className="iqac-file-item__arrow" aria-hidden="true">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </span>
  </a>
);

/* ------------------------------------------------------------------ */
/*  FEEDBACK DETAILS — tabbed table (matches live ncms.co.in/iqac)      */
/* ------------------------------------------------------------------ */
const FeedbackDetailsTable = ({ feedback }: { feedback: any }) => {
  const tabs: string[] = feedback.tabs || ["Feedback Filled Form", "Feedback Analysis", "Action Taken Report"];
  const [active, setActive] = useState(tabs[0]);
  const columns: string[] = feedback.columnHeaders?.[active] || [];
  const rows: any[] = feedback.feedbackData?.[active] || [];

  if (rows.length === 0) return null;

  return (
    <div className="iqac-feedback-table">
      <div className="iqac-feedback-table__tabs" role="tablist" aria-label="Feedback categories">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            className={`iqac-feedback-table__tab${active === tab ? " is-active" : ""}`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="iqac-feedback-table__scroll">
        <table className="iqac-feedback-table__grid">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any, r: number) => (
              <tr key={r}>
                <td className="iqac-feedback-table__name">{row.name}</td>
                {(row.feedbacks || []).map((pdf: string, c: number) => (
                  <td key={c}>
                    {pdf ? (
                      <a className="iqac-feedback-table__btn" href={media(pdf)} target="_blank" rel="noreferrer">
                        View Feedback
                      </a>
                    ) : (
                      <span className="iqac-feedback-table__na">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* PEER TEAM — auto-scrolling image marquee (matches live) */
const PeerTeamMarquee = ({ images }: { images: string[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || paused) return;
    const timer = setInterval(() => {
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: el.clientWidth / 2, behavior: "smooth" });
    }, 3000);
    return () => clearInterval(timer);
  }, [paused]);

  if (images.length === 0) return null;

  return (
    <motion.section className="iqac-peer-wrap" {...reveal}>
      <div className="section-header">
        <span className="section-badge">OUR TEAM</span>
        <h2 className="section-title">Peer Team</h2>
      </div>
      <div
        ref={ref}
        className="iqac-peer-marquee"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {images.map((src, i) => (
          <div className="iqac-peer-marquee__card" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media(src)} alt={`Peer Team ${i + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </motion.section>
  );
};

/* Tabbed document library (NAAC reports / feedback groups) */
const NaacReportsLibrary = ({ groups }: { groups: Record<string, { id: string; label: string; description: string; items: any[] }> }) => {
  const groupList = Object.values(groups);
  const [activeGroup, setActiveGroup] = useState(groupList[0]?.id);
  const [visibleCount, setVisibleCount] = useState(4);
  const current = groups[activeGroup] || groupList[0];

  useEffect(() => {
    setVisibleCount(4);
  }, [activeGroup]);

  if (!current) return null;
  const visibleItems = current.items.slice(0, visibleCount);

  return (
    <div className="iqac-doc-library">
      <div className="iqac-doc-library__tabs" role="tablist" aria-label="Document categories">
        {groupList.map((group) => (
          <button
            key={group.id}
            type="button"
            role="tab"
            aria-selected={activeGroup === group.id}
            className={`iqac-doc-library__tab${activeGroup === group.id ? " is-active" : ""}`}
            onClick={() => setActiveGroup(group.id)}
          >
            {group.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="iqac-doc-library__panel"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className="iqac-doc-library__head">
            <p>{current.description}</p>
          </header>

          <div className="iqac-file-list">
            {visibleItems.map((doc, idx) => (
              <IqacDocRow key={`${current.id}-${idx}`} doc={doc} />
            ))}
          </div>

          {(visibleCount < current.items.length || visibleCount > 4) && (
            <div className="iqac-doc-library__more">
              {visibleCount < current.items.length && (
                <button type="button" onClick={() => setVisibleCount((c) => c + 4)}>
                  Show more documents
                </button>
              )}
              {visibleCount > 4 && (
                <button type="button" className="is-muted" onClick={() => setVisibleCount(4)}>
                  Show less
                </button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* Policy documents library */
const PolicyDocumentsLibrary = ({ items }: { items: any[] }) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const visibleItems = items.slice(0, visibleCount);

  return (
    <div className="iqac-doc-library iqac-doc-library--policies">
      <header className="iqac-doc-library__head iqac-doc-library__head--solo">
        <p>Institutional policies on quality assurance, student welfare, research, and governance.</p>
      </header>

      <div className="iqac-file-list">
        {visibleItems.map((doc, idx) => (
          <IqacDocRow key={idx} doc={doc} />
        ))}
      </div>

      {(visibleCount < items.length || visibleCount > 6) && (
        <div className="iqac-doc-library__more">
          {visibleCount < items.length && (
            <button type="button" onClick={() => setVisibleCount((c) => c + 3)}>
              Show more policies
            </button>
          )}
          {visibleCount > 6 && (
            <button type="button" className="is-muted" onClick={() => setVisibleCount(6)}>
              Show less
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* Premium document card for the document hub */
const PremiumDocCard = ({ doc, iconSvg }: { doc: any; iconSvg?: React.ReactNode }) => (
  <a href={media(doc.file || doc.link)} target="_blank" rel="noreferrer" className="premium-doc-card">
    <div className="doc-icon-top">
      {iconSvg || (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      )}
    </div>
    <div className="doc-title-main">{doc.title}</div>
    <div className="doc-subtitle">PDF Document</div>
    <div className="doc-action-bottom">
      <span>View Document</span>
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </div>
  </a>
);

/* Accreditation hub — side rail of categories + animated stage */
const AccreditationHub = ({ hub }: { hub: Record<string, any> }) => {
  const hubList = Object.values(hub);
  const [activeHub, setActiveHub] = useState(hubList[0]?.id);
  const current = hub[activeHub] || hubList[0];

  if (!current) return null;

  return (
    <div className="iqac-acc-hub">
      <div className="iqac-acc-hub__shell">
        <aside className="iqac-acc-hub__rail" aria-label="Accreditation categories">
          <p className="iqac-acc-hub__rail-label">Select category</p>
          {hubList.map((h) => (
            <button
              key={h.id}
              type="button"
              className={`iqac-acc-hub__tab${activeHub === h.id ? " is-active" : ""}`}
              onClick={() => setActiveHub(h.id)}
              aria-pressed={activeHub === h.id}
            >
              <span className="iqac-acc-hub__tab-eyebrow">{h.eyebrow}</span>
              <span className="iqac-acc-hub__tab-title">{h.tabLabel}</span>
              <span className="iqac-acc-hub__tab-stat">{h.stat}</span>
            </button>
          ))}
        </aside>

        <div className="iqac-acc-hub__stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="iqac-acc-hub__panel"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <header className="iqac-acc-hub__panel-head">
                <span className="iqac-acc-hub__panel-eyebrow">{current.eyebrow}</span>
                <h3>{current.title}</h3>
                <p>{current.description}</p>
              </header>

              <div className="iqac-acc-hub__destinations">
                {(current.links || []).map((link: any, index: number) => (
                  <a key={link.to || index} href={media(link.to)} target="_blank" rel="noreferrer" className="iqac-acc-hub__dest">
                    <span className="iqac-acc-hub__dest-num">{String(index + 1).padStart(2, "0")}</span>
                    <span className="iqac-acc-hub__dest-body">
                      <strong>{link.label}</strong>
                      <small>{link.meta}</small>
                    </span>
                    <span className="iqac-acc-hub__dest-cta">
                      Open
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* Load-more grid helper */
const ExpandableGrid = ({
  items,
  initialCount = 3,
  renderItem,
  gridClass = "hub-grid",
  gridStyle = {},
}: {
  items: any[];
  initialCount?: number;
  renderItem: (item: any, idx: number) => React.ReactNode;
  gridClass?: string;
  gridStyle?: React.CSSProperties;
}) => {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  if (!items || items.length === 0) return null;

  return (
    <div style={{ marginBottom: "3rem" }}>
      <div className={gridClass} style={gridStyle}>
        {items.slice(0, visibleCount).map(renderItem)}
      </div>
      {(visibleCount < items.length || visibleCount > initialCount) && (
        <div className="load-more-container" style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
          {visibleCount < items.length && (
            <button className="load-more-btn" onClick={() => setVisibleCount((prev) => prev + initialCount)}>
              Load More
            </button>
          )}
          {visibleCount > initialCount && (
            <button className="load-more-btn" onClick={() => setVisibleCount(initialCount)}>
              Load Less
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const SectionHeading = ({ children, fontSize = "1.4rem" }: { children: React.ReactNode; fontSize?: string }) => (
  <h3 className="iqac-subhead" style={{ marginBottom: "1.5rem", fontSize, color: "#0e2455", fontWeight: 800 }}>
    <span className="iqac-subhead__bar" aria-hidden="true" />
    {children}
  </h3>
);

/* ------------------------------------------------------------------ */
/*  IQAC page                                                           */
/* ------------------------------------------------------------------ */
const IQAC = () => {
  const { data: liveData } = useLiveData(getIqac, IQACDataJson);
  const IQACData = (liveData as any)?.data || liveData || (IQACDataJson as any)?.data || IQACDataJson || {};

  const [showAllMembers, setShowAllMembers] = useState(false);
  const [activeTab, setActiveTab] = useState("core");

  const hero = IQACData.bannerSection || {};
  const aboutSec = IQACData.AboutVisionMissionSections || {};
  const visionMission = aboutSec.VisionMission || {};
  const governance = IQACData.GovernancePolicies || {};
  const members = IQACData.iqacMembersSection || {};
  const feedback = IQACData.feedBackDetails || {};
  const policiesSec = IQACData.policyDocuments || {};
  const initiatives = IQACData.Initiatives_And_Best_Practices || {};
  const reportsSec = IQACData.Reports_And_Documentation || {};
  const accreditation = IQACData.Accreditation_And_Evaluation || {};

  /* ---- stats derived from real data ---- */
  const stats = useMemo(() => {
    const mems = (members.members || []).length;
    const policies = (policiesSec.sections || []).length;
    const sections = reportsSec.DocumentsSection || [];
    const monthly =
      sections.find((s: any) => /monthly/i.test(s.title || ""))?.FilesSection?.length ||
      sections.reduce((n: number, s: any) => n + (s.FilesSection?.length || 0), 0);
    const fdps = initiatives.Quality_Initiative?.Files?.length || 0;
    return [
      { value: mems, label: "IQAC Members", suffix: "" },
      { value: policies, label: "Institutional Policies", suffix: "" },
      { value: monthly, label: "Monthly Reports", suffix: "" },
      { value: fdps, label: "FDPs & Workshops", suffix: "+" },
    ];
  }, [members, policiesSec, reportsSec, initiatives]);

  /* ---- about section ---- */
  const about = useMemo(() => {
    const aboutPart = aboutSec.AboutSection || {};
    const desc = Array.isArray(aboutPart.descriptions) ? aboutPart.descriptions.join(" ") : aboutPart.description || "";
    const pillars: any[] = [];
    (governance.AccordionSections || []).forEach((a: any) => {
      pillars.push({ tag: (a.title || "Policy").toUpperCase(), title: a.title, description: "", points: a.points || [] });
    });
    return { eyebrow: "About", heading: aboutPart.title || "About IQAC", description: desc, pillars };
  }, [aboutSec, governance]);

  /* ---- vision / mission (navy band) ---- */
  const vmg = useMemo(() => {
    return (visionMission.sections || []).map((s: any) => {
      const t = (s.title || "").toLowerCase();
      const kind = t.includes("vision") ? "vision" : t.includes("mission") ? "mission" : "goal";
      return { kind, title: s.title, description: s.description || "", points: s.points || [] };
    });
  }, [visionMission]);

  /* ---- members ---- */
  const memberItems = (members.members || []).map((m: any, i: number) => ({
    sn: m.id ?? i + 1,
    name: m.name,
    designation: m.designation,
    position: m.position,
  }));
  const displayedMembers = showAllMembers ? memberItems : memberItems.slice(0, 8);

  /* ---- document hub (NCET core/academics/quality tabs) ---- */
  const docHub = useMemo(() => {
    const sections = reportsSec.DocumentsSection || [];
    const pick = (re: RegExp) => {
      const sec = sections.find((s: any) => re.test(s.title || ""));
      return (sec?.FilesSection || []).map((f: any) => ({ title: f.title, file: f.pdf || f.file }));
    };
    const minutes = pick(/minutes/i);
    const monthly = pick(/monthly/i);

    /* Quality & Feedback → stakeholder feedback forms (filled) */
    const years = (feedback.columnHeaders?.["Feedback Filled Form"] || []).slice(1);
    const surveys: any[] = [];
    (feedback.feedbackData?.["Feedback Filled Form"] || []).forEach((row: any) => {
      (row.feedbacks || []).forEach((f: string, i: number) => {
        const year = yearLabel(years[i]);
        surveys.push({ title: `${row.name} Feedback${year}`, file: f });
      });
    });

    return {
      minutes,
      monthly,
      surveys,
      academics: [] as any[],
    };
  }, [reportsSec, feedback]);

  /* ---- accreditation hub + self-study reports ---- */
  const accData = useMemo(() => {
    const sections = accreditation.DocumentsSection || [];
    const hub: Record<string, any> = {};
    sections.forEach((sec: any, i: number) => {
      hub[sec.title || `group-${i}`] = {
        id: sec.title || `group-${i}`,
        eyebrow: /naac/i.test(sec.title || "") ? "NAAC" : "IQAC",
        tabLabel: sec.title,
        stat: "View",
        title: sec.title,
        description: "Accreditation and evaluation documents of Nagarjuna College of Management Studies.",
        links: (sec.FilesSection || []).map((f: any) => ({ to: f.pdf || f.file, label: f.title, meta: "PDF Document" })),
      };
    });
    const selfStudyItems = sections.flatMap((sec: any) =>
      (sec.FilesSection || []).map((f: any) => ({ title: f.title, file: f.pdf || f.file }))
    );
    return { hub, selfStudyItems };
  }, [accreditation]);

  const naacGroups = {
    selfStudy: {
      id: "selfStudy",
      label: "Self Study Reports",
      description: "Self-study reports, institutional information, and DVV clarifications submitted for NAAC assessment.",
      items: accData.selfStudyItems,
    },
  };

  /* ---- policies ---- */
  const policies = (policiesSec.sections || []).map((s: any) => ({ title: s.title, file: s.pdf || s.file }));

  /* ---- feedback analysis + action taken groups ---- */
  const feedbackGroups = useMemo(() => {
    const build = (tab: string, desc: string) => {
      const years = (feedback.columnHeaders?.[tab] || []).slice(1);
      const items: any[] = [];
      (feedback.feedbackData?.[tab] || []).forEach((row: any) => {
        (row.feedbacks || []).forEach((f: string, i: number) => {
          const year = yearLabel(years[i]);
          items.push({ title: `${row.name}${year}`, file: f });
        });
      });
      return { id: tab, label: tab, description: desc, items };
    };
    const groups: Record<string, any> = {};
    if (feedback.feedbackData?.["Feedback Analysis"]) groups.analysis = build("Feedback Analysis", "Feedback analysis reports from students, teachers, parents and alumni across academic years.");
    if (feedback.feedbackData?.["Action Taken Report"]) groups.atr = build("Action Taken Report", "Action taken reports on feedback received, year by year.");
    return groups;
  }, [feedback]);

  /* ---- initiatives & best practices ---- */
  const initiativeDocs = useMemo(() => {
    const files: { title: string; file?: string | null; link?: string | null }[] = [];
    (initiatives.Documents || []).forEach((group: any) => {
      (group.Files || []).forEach((f: any) => {
        files.push({ title: `${group.title} — ${f.title}`, file: f.pdf || f.file, link: f.link || null });
      });
    });
    return files;
  }, [initiatives]);
  const qualityInitiatives = (initiatives.Quality_Initiative?.Files || []).map((f: any) =>
    typeof f === "string" ? f : f.title || ""
  );

  return (
    <div className="iqac-page-root">
      <IqacDecor />

      <div className="iqac-page-content">
        {/* Hero / Banner */}
        <PageBanner
          title={hero.heading || "IQAC"}
          eyebrow="Internal Quality Assurance Cell"
          subtitle={hero.description || "Ensuring continuous improvement and quality enhancement of the institution."}
          image={hero.bannerImage}
        />

        {/* Credibility stats band — navy glassy */}
        {stats.some((s) => s.value > 0) && (
          <motion.section className="iqac-stats" {...reveal}>
            <span className="iqac-stats__orb iqac-stats__orb--1" aria-hidden="true" />
            <span className="iqac-stats__orb iqac-stats__orb--2" aria-hidden="true" />
            <div className="iqac-stats__inner">
              {stats.map((s, i) => (
                <div key={i} className="iqac-stats__item">
                  <div className="iqac-stats__value">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="iqac-stats__label">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* About Section */}
        <motion.section className="iqac-about-v2" {...reveal}>
          <div className="iqac-about-v2__inner">
            <div className="iqac-about-v2__intro">
              <span className="iqac-eyebrow">{about.eyebrow}</span>
              <h2>{highlight(about.heading, "IQAC")}</h2>
              <p>{about.description}</p>
            </div>

          </div>
        </motion.section>

        {/* Vision / Mission — navy glassy band */}
        {vmg.length > 0 && (
          <motion.section className="iqac-vm-wrap" {...reveal}>
            <div className="iqac-vm">
              <span className="iqac-vm__orb iqac-vm__orb--1" aria-hidden="true" />
              <span className="iqac-vm__orb iqac-vm__orb--2" aria-hidden="true" />
              <div className="iqac-vm__head">
                <span className="iqac-vm__eyebrow">Our Core Purpose</span>
                <h2 className="iqac-vm__title">{visionMission.title || "Vision & Mission"}</h2>
              </div>
              <div className="iqac-vm__grid">
                {vmg.map((card: any, i: number) => (
                  <motion.article
                    key={i}
                    className="iqac-vm__card"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <span className={`iqac-vm__shape iqac-vm__shape--${card.kind}`} aria-hidden="true" />
                    <div className={`iqac-vm__icon iqac-vm__icon--${card.kind}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {card.kind === "vision" ? (
                          <>
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        ) : card.kind === "mission" ? (
                          <>
                            <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z" />
                          </>
                        ) : (
                          <>
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3.5 2" />
                          </>
                        )}
                      </svg>
                    </div>
                    <h3 className="iqac-vm__card-title">{card.title}</h3>
                    {card.description && <p className="iqac-vm__text">{card.description}</p>}
                    {card.points.length > 0 && (
                      <ul className="iqac-vm__list">
                        {card.points.map((p: string, j: number) => (
                          <li key={j}>{p}</li>
                        ))}
                      </ul>
                    )}
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Governance pillars */}
        {about.pillars.length > 0 && (
          <motion.section className="iqac-pillars-wrap" {...reveal}>
            <div className="section-header">
              <span className="section-badge">Governance</span>
              <h2 className="section-title">Policies &amp; Functions</h2>
            </div>
            <div className="iqac-pillars">
              {about.pillars.map((p: any, i: number) => {
                const mod = (p.tag || "").trim().toLowerCase();
                return (
                  <article className={`iqac-pillar iqac-pillar--${mod}`} key={i}>
                    <div className="iqac-pillar__rail">
                      <span className="iqac-pillar__icon">
                        {PILLAR_ICONS[mod] || <ShieldCheck size={26} strokeWidth={2} />}
                      </span>
                    </div>
                    <div className="iqac-pillar__body">
                      <div className="iqac-pillar__head">
                        <h3>{p.title}</h3>
                        <span className="iqac-pillar__tag">{p.tag}</span>
                      </div>
                      {p.points && p.points.length > 0 ? (
                        <ul className="iqac-pillar__list">
                          {p.points.map((pt: string, idx: number) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{p.description}</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* PEER TEAM images — auto-scroll marquee (matches live) */}
        <PeerTeamMarquee images={(IQACData.iqacImages || []).map((s: string) => s)} />

        {/* Members Section */}
        {memberItems.length > 0 && (
          <motion.section className="iqac-members-v2" {...reveal}>
            <div className="iqac-members-v2__inner">
              <div className="iqac-section-head">
                <span className="iqac-eyebrow">Our Team</span>
                <h2>{highlight(members.title || "Members of IQAC", "IQAC")}</h2>
                <p>The Internal Quality Assurance Cell of Nagarjuna College of Management Studies.</p>
              </div>

              <div className="iqac-members-grid">
                {displayedMembers.map((member: any) => (
                  <article className="iqac-member-card" key={member.sn}>
                    <div className="iqac-member-card__index">{String(member.sn).padStart(2, "0")}</div>
                    <div className="iqac-member-card__body">
                      <h3>{member.name}</h3>
                      <span>{member.position || member.designation}</span>
                      <em>{member.designation}</em>
                    </div>
                  </article>
                ))}
              </div>

              {memberItems.length > 8 && (
                <div className="iqac-members-toggle">
                  <button type="button" onClick={() => setShowAllMembers(!showAllMembers)}>
                    {showAllMembers ? "Show Less Members" : "View All Members"}
                  </button>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* FEEDBACK DETAILS — tabbed table (matches live) */}
        {Object.keys(feedback.feedbackData || {}).length > 0 && (
          <motion.section className="iqac-feedback-wrap" {...reveal}>
            <div className="section-header">
              <span className="section-badge">STAKEHOLDER FEEDBACK</span>
              <h2 className="section-title">{highlight("Feedback Details", "Feedback")}</h2>
            </div>
            <FeedbackDetailsTable feedback={feedback} />
          </motion.section>
        )}

        {/* Interactive Document Hub */}
        <motion.section className="document-hub-section" {...reveal}>
          <div className="section-header">
            <span className="section-badge">RESOURCES</span>
            <h2 className="section-title">{highlight("IQAC Document Hub", "Document Hub")}</h2>
          </div>

          <div className="hub-tabs">
            <button className={`hub-tab-btn ${activeTab === "core" ? "active" : ""}`} onClick={() => setActiveTab("core")}>
              <span className="hub-tab-btn__icon">
                <FolderOpen size={17} strokeWidth={2.2} />
              </span>
              Core Documents
              <span className="hub-tab-btn__count">{docHub.minutes.length + docHub.monthly.length}</span>
            </button>
          </div>

          <motion.div
            className="hub-content"
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === "core" && (
              <>
                <SectionHeading>Minutes of Meeting</SectionHeading>
                <ExpandableGrid items={docHub.minutes} renderItem={(doc, idx) => <PremiumDocCard key={idx} doc={doc} />} />

                <SectionHeading>Monthly Reports</SectionHeading>
                <ExpandableGrid items={docHub.monthly} renderItem={(doc, idx) => <PremiumDocCard key={idx} doc={doc} />} />
              </>
            )}
          </motion.div>
        </motion.section>

        {/* Accreditation Hub */}
        {Object.keys(accData.hub).length > 0 && (
          <motion.section className="iqac-accreditation-wrap" {...reveal}>
            <div className="section-header">
              <span className="section-badge">ACCREDITATION</span>
              <h2 className="section-title">Accreditation &amp; Compliance</h2>
            </div>
            <AccreditationHub hub={accData.hub} />
          </motion.section>
        )}

        {/* Self Study Reports */}
        {accData.selfStudyItems.length > 0 && (
          <motion.section className="iqac-reports-wrap" {...reveal}>
            <div className="section-header">
              <span className="section-badge">NAAC REPORTS</span>
              <h2 className="section-title">Self Study &amp; Evaluation Reports</h2>
            </div>
            <NaacReportsLibrary groups={naacGroups} />
          </motion.section>
        )}

        {/* Policy Documents */}
        {policies.length > 0 && (
          <motion.section className="iqac-policies-wrap" {...reveal}>
            <div className="section-header">
              <span className="section-badge">POLICIES</span>
              <h2 className="section-title">Policy Documents</h2>
            </div>
            <PolicyDocumentsLibrary items={policies} />
          </motion.section>
        )}

        {/* Feedback Analysis & Action Taken */}
        {Object.keys(feedbackGroups).length > 0 && (
          <motion.section className="iqac-reports-wrap" {...reveal}>
            <div className="section-header">
              <span className="section-badge">FEEDBACK</span>
              <h2 className="section-title">Feedback Analysis &amp; Action Taken</h2>
            </div>
            <NaacReportsLibrary groups={feedbackGroups} />
          </motion.section>
        )}

        {/* Initiatives & Best Practices */}
        {(initiativeDocs.length > 0 || qualityInitiatives.length > 0) && (
          <motion.section className="iqac-policies-wrap" {...reveal}>
            <div className="section-header">
              <span className="section-badge">INITIATIVES</span>
              <h2 className="section-title">Initiatives &amp; Best Practices</h2>
            </div>

            {initiativeDocs.length > 0 && (
              <div className="iqac-doc-library iqac-doc-library--policies">
                <header className="iqac-doc-library__head iqac-doc-library__head--solo">
                  <p>Mission MAC programmes and documented best practices of the institution.</p>
                </header>
                <div className="iqac-file-list">
                  {initiativeDocs.map((doc, idx) => (
                    <IqacDocRow key={idx} doc={doc} />
                  ))}
                </div>
              </div>
            )}

            {qualityInitiatives.length > 0 && (
              <div style={{ marginTop: "2.5rem" }}>
                <SectionHeading>{initiatives.Quality_Initiative?.title || "Quality Initiatives"}</SectionHeading>
                <ol className="iqac-init-list">
                  {qualityInitiatives.map((item: string, i: number) => (
                    <li className="iqac-init-item" key={i}>
                      <span className="iqac-init-num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="iqac-init-text">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default IQAC;
