"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import PageBanner from "@/components/PageBanner/PageBanner";

// ---- helpers ---------------------------------------------------------------
const pick = (obj: any, ...keys: string[]) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== null && v !== undefined) return v;
  }
  return null;
};
const str = (s: any) => (s == null ? "" : String(s));
const splitLines = (s: string) =>
  str(s)
    .split("\n")
    .map((line, i, a) => (
      <React.Fragment key={i}>
        {line}
        {i < a.length - 1 && <br />}
      </React.Fragment>
    ));

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const Reveal = ({ children, className = "" }: any) => (
  <motion.div
    className={className}
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.15 }}
  >
    {children}
  </motion.div>
);

// NDC-style icons — Eye (vision, blue), Target (mission, orange)
const VMG_ICONS: Record<string, React.ReactNode> = {
  vision: (
    <>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  mission: (
    <>
      <path d="M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945a8 8 0 1 0-9.945-9.945" />
      <path d="M12 4a8 8 0 0 1 8.945 8.945H19a2 2 0 0 0-2-2h-1a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2z" />
    </>
  ),
  goal: (
    <>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </>
  ),
};

const SectionHead = ({ eyebrow, title, lead }: any) => (
  <div className="sc-hub__head" style={{ marginBottom: "24px" }}>
    <div>
      {eyebrow && <span className="sc-eyebrow">{eyebrow}</span>}
      <h2 className="sc-title">{title}</h2>
      {lead && (
        <p className="sc-lead" style={{ margin: "10px 0 0", maxWidth: "none", textAlign: "left" }}>
          {lead}
        </p>
      )}
    </div>
  </div>
);

const PDF_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);
const PDF_ICON_LINES = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
  </svg>
);
const ARROW_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// PDF link that opens in a new tab.
const PdfLink = ({ pdf, className, children, label }: any) => {
  if (!pdf) return null;
  return (
    <a href={pdf} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>
      {children}
    </a>
  );
};

// Tabbed document library (Research Cell resources/publications, etc.)
const TabbedDocs = ({ tabs, eyebrow, title, lead }: any) => {
  const [active, setActive] = useState(0);
  const list = (tabs || []).filter(Boolean);
  if (!list.length) return null;
  const current = list[active] || list[0];

  return (
    <Reveal className="sc-cell-tabs">
      <SectionHead eyebrow={eyebrow} title={title} lead={lead} />
      <div className="sc-cell-tabs__bar" role="tablist" aria-label={title}>
        {list.map((tab: any, i: number) => (
          <button
            key={tab.TabName || i}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`sc-cell-tabs__btn${i === active ? " is-active" : ""}`}
            onClick={() => setActive(i)}
          >
            {tab.TabName}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={current.TabName || active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="sc-cell-tabs__panel"
        >
          {(current.Documents || []).map((doc: any, j: number) => (
            <PdfLink key={`${current.TabName}-${j}`} pdf={doc?.pdf} className="sc-cell-docrow" label={doc?.title}>
              <span className="sc-cell-docrow__pdf">{PDF_ICON}</span>
              <span className="sc-cell-docrow__title">{doc?.title}</span>
              {doc?.pdf && (
                <span className="sc-cell-docrow__view">
                  View {ARROW_ICON}
                </span>
              )}
            </PdfLink>
          ))}
          {(current.Descriptions || []).map((d: string, j: number) => (
            <p key={`d-${j}`} className="sc-cell-tabs__desc">
              {splitLines(d)}
            </p>
          ))}
        </motion.div>
      </AnimatePresence>
    </Reveal>
  );
};

const CellPage = ({ data, eyebrow = "Student Center" }: { data: any; eyebrow?: string }) => {
  const [vacYear, setVacYear] = useState(0);
  if (!data) return null;

  // ---- normalize the varying CMS shapes ----
  const banner = pick(data, "BannerSection", "banner");
  const avm = pick(data, "AboutVisionMissionSections", "aboutVisionMissionSections", "aboutAntiRagging");
  const about = pick(avm, "AboutSection") || pick(data, "About", "aboutSection");
  const vmg = pick(avm, "VisionMission")?.VMSections || [];
  const accordion = pick(avm, "AccordionSections") || pick(data, "Objectives");
  const policies = pick(data, "Policies_And_Composition", "policyAndComposition", "antiRaggingCommittee");
  const report = pick(data, "antiRaggingCell", "report");
  const activities = pick(data, "Activities", "Report");
  const gallery = pick(data, "Our_Gallery", "gallery");
  const nptel = pick(data, "Establishment_Of_NPTL");
  const pragyan = pick(data, "PodcastAndBlogs");
  const researchRes = pick(data, "Resources_And_Events");
  const publications = pick(data, "Publications");
  const vacYears = pick(data, "yearWiseCourses");
  const years = vacYears?.years || [];
  const safeYear = Math.min(vacYear, Math.max(0, years.length - 1));

  const aboutDesc = about?.descriptions || about?.AboutDescriptions || [];
  const hasAbout = about && (str(about?.title) || aboutDesc.length);

  // Unified accordion/objective list (array OR {title, Points})
  const accordionList = Array.isArray(accordion)
    ? accordion
    : accordion && accordion.Points?.length
      ? [{ title: accordion.title, points: accordion.Points }]
      : [];

  return (
    <div className="sc-page">
      <PageBanner
        title={banner?.title || "Student Center"}
        eyebrow={eyebrow}
        subtitle={`${eyebrow} — everything you need to know about ${banner?.title || "this cell"}.`}
        image={banner?.image}
      />

      <div className="container">
        {/* ---- About ---- */}
        {hasAbout && (
          <section className="sc-section">
            <Reveal>
              <div className="sc-cell-about">
                <span className="sc-eyebrow">Overview</span>
                <h2 className="sc-title">{about?.title}</h2>
                <div className="sc-cell-about__body">
                  {aboutDesc.map((para: string, i: number) => (
                    <p key={i}>{splitLines(para)}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* ---- Vision / Mission — NDC style (dark navy glassy cards) ---- */}
        {vmg.length > 0 && (
          <section className="sc-section">
            <Reveal className="sc-cell-vm-wrap">
              <div className="sc-cell-vm">
                <span className="sc-cell-vm__orb sc-cell-vm__orb--1" aria-hidden="true" />
                <span className="sc-cell-vm__orb sc-cell-vm__orb--2" aria-hidden="true" />
                <div className="sc-cell-vm__head">
                  <span className="sc-cell-vm__eyebrow">{pick(avm, "VisionMission")?.title?.includes("Vision") ? "Our Core Purpose" : "Direction"}</span>
                  <h2 className="sc-cell-vm__title">{pick(avm, "VisionMission")?.title || "Vision & Mission"}</h2>
                </div>
                <div className="sc-cell-vm__grid">
                  {vmg.map((card: any, i: number) => {
                    const t = str(card.title).toLowerCase();
                    const kind = t.includes("vision") ? "vision" : t.includes("mission") ? "mission" : "goal";
                    const points = card.ListPoints || card.listPoints || [];
                    return (
                      <motion.article key={i} className="sc-cell-vm__card" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                        <span className={`sc-cell-vm__shape sc-cell-vm__shape--${kind}`} aria-hidden="true" />
                        <div className={`sc-cell-vm__icon sc-cell-vm__icon--${kind}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            {VMG_ICONS[kind] || VMG_ICONS.goal}
                          </svg>
                        </div>
                        <h3 className="sc-cell-vm__card-title">{card.title}</h3>
                        {card.description && <p className="sc-cell-vm__text">{splitLines(card.description)}</p>}
                        {points.length > 0 && (
                          <ul className="sc-cell-vm__list">
                            {points.map((p: string, j: number) => (
                              <li key={j}>{splitLines(p)}</li>
                            ))}
                          </ul>
                        )}
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* ---- Objectives / Functions (accordion points) ---- */}
        {accordionList.length > 0 && (
          <section className="sc-section">
            <SectionHead eyebrow="Focus Areas" title={accordion?.title || "Objectives"} />
            <motion.div className="sc-cell-points" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
              {accordionList.map((sec: any, i: number) => (
                <motion.article key={i} className="sc-cell-points__card" variants={fadeUp}>
                  <span className="sc-cell-points__num">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="sc-cell-points__title">{sec.title}</h3>
                  <ul className="sc-cell-points__list">
                    {(sec.points || sec.Points || []).map((p: string, j: number) => (
                      <li key={j}>
                        <span className="sc-cell-points__dot" aria-hidden="true" />
                        {splitLines(p)}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </motion.div>
          </section>
        )}

        {/* ---- Policies & Composition ---- */}
        {policies && (policies?.Document1 || policies?.Document2 || policies?.image) && (
          <section className="sc-section">
            <SectionHead eyebrow="Guidelines" title={policies?.title || "Policies & Composition"} lead={policies?.description} />
            <div className="sc-cell-policy">
              {policies?.image && (
                <div className="sc-cell-policy__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={policies.image} alt={policies.title || "Policy"} loading="lazy" />
                </div>
              )}
              <div className="sc-policy" style={policies?.image ? { flex: "1 1 auto" } : { gridColumn: "1 / -1" }}>
                {policies?.Document1 && (
                  <PdfLink pdf={policies.Document1} className="sc-policy__card" label={policies?.DocumentTitle1 || "View Policy"}>
                    <span className="sc-policy__card-pdf">{PDF_ICON}</span>
                    <span className="sc-policy__card-txt">
                      <span className="sc-policy__card-title">{policies?.DocumentTitle1 || "View Policy"}</span>
                      <span className="sc-policy__card-sub">Official document · PDF</span>
                    </span>
                    <span className="sc-policy__card-arrow">{ARROW_ICON}</span>
                  </PdfLink>
                )}
                {policies?.Document2 && (
                  <PdfLink pdf={policies.Document2} className="sc-policy__card" label={policies?.DocumentTitle2 || "View Composition"}>
                    <span className="sc-policy__card-pdf">{PDF_ICON_LINES}</span>
                    <span className="sc-policy__card-txt">
                      <span className="sc-policy__card-title">{policies?.DocumentTitle2 || "View Composition"}</span>
                      <span className="sc-policy__card-sub">Official document · PDF</span>
                    </span>
                    <span className="sc-policy__card-arrow">{ARROW_ICON}</span>
                  </PdfLink>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ---- Report (single PDF card with image) ---- */}
        {report && (report?.pdf || report?.image) && (
          <section className="sc-section">
            <div className="sc-maitri">
              <div className="sc-maitri__card">
                <span className="sc-maitri__badge">Activity Report</span>
                <h3 className="sc-maitri__title">{report?.title || "Report"}</h3>
                {report?.description && <p className="sc-maitri__text">{splitLines(report.description)}</p>}
                {report?.pdf && (
                  <PdfLink pdf={report.pdf} className="sc-maitri__btn" label={report?.buttonText || "View Report"}>
                    {report?.buttonText || "View Report"} {ARROW_ICON}
                  </PdfLink>
                )}
              </div>
              {report?.image && (
                <div className="sc-maitri__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={report.image} alt={report?.title || "Report"} loading="lazy" />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ---- Activities ---- */}
        {activities && (activities?.Sections || activities?.sections) && (
          <section className="sc-section">
            <SectionHead eyebrow="Highlights" title={activities?.title || "Activities"} lead={activities?.description} />
            <motion.div className="sc-cell-act" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
              {(activities?.Sections || activities?.sections || []).map((sec: any, i: number) => (
                <motion.article key={i} className="sc-cell-act__card" variants={fadeUp}>
                  <span className="sc-cell-act__num">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="sc-cell-act__title">{sec.title}</h3>
                  {sec.description && <p className="sc-cell-act__text">{splitLines(sec.description)}</p>}
                  {sec.pdf && (
                    <PdfLink pdf={sec.pdf} className="sc-cell-act__btn" label="View Document">
                      View Document {ARROW_ICON}
                    </PdfLink>
                  )}
                </motion.article>
              ))}
            </motion.div>
          </section>
        )}

        {/* ---- NPTEL establishment ---- */}
        {nptel && (nptel?.Document1 || nptel?.Document2) && (
          <section className="sc-section">
            <SectionHead eyebrow="Chapter" title={nptel?.title || "Establishment of NPTEL"} lead={nptel?.description} />
            <div className="sc-cell-policy">
              {nptel?.image && (
                <div className="sc-cell-policy__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={nptel.image} alt={nptel.title} loading="lazy" />
                </div>
              )}
              <div className="sc-policy" style={nptel?.image ? { flex: "1 1 auto" } : { gridColumn: "1 / -1" }}>
                {nptel?.Document1 && (
                  <PdfLink pdf={nptel.Document1} className="sc-policy__card" label={nptel?.DocumentTitle1 || "Establishment"}>
                    <span className="sc-policy__card-pdf">{PDF_ICON}</span>
                    <span className="sc-policy__card-txt">
                      <span className="sc-policy__card-title">{nptel?.DocumentTitle1 || "Establishment"}</span>
                      <span className="sc-policy__card-sub">Document · PDF</span>
                    </span>
                    <span className="sc-policy__card-arrow">{ARROW_ICON}</span>
                  </PdfLink>
                )}
                {nptel?.Document2 && (
                  <PdfLink pdf={nptel.Document2} className="sc-policy__card" label={nptel?.DocumentTitle2 || "Achievements"}>
                    <span className="sc-policy__card-pdf">{PDF_ICON_LINES}</span>
                    <span className="sc-policy__card-txt">
                      <span className="sc-policy__card-title">{nptel?.DocumentTitle2 || "Achievements"}</span>
                      <span className="sc-policy__card-sub">Document · PDF</span>
                    </span>
                    <span className="sc-policy__card-arrow">{ARROW_ICON}</span>
                  </PdfLink>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ---- Pragyan podcast & blogs ---- */}
        {pragyan && (pragyan?.TextOneLink || pragyan?.TextTwoLink) && (
          <section className="sc-section">
            <SectionHead eyebrow="Media" title={pragyan?.title || "Podcast & Blogs"} lead={pragyan?.description} />
            <div className="sc-cell-media">
              {pragyan?.image && (
                <div className="sc-cell-media__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pragyan.image} alt={pragyan.title} loading="lazy" />
                </div>
              )}
              <div className="sc-cell-media__links">
                {pragyan?.TextOneLink && (
                  <a href={pragyan.TextOneLink} target="_blank" rel="noopener noreferrer" className="sc-cell-media__link">
                    <span className="sc-cell-media__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <span>
                      <strong>{pragyan?.TextOne || "View Blog"}</strong>
                      <small>Read our blog</small>
                    </span>
                    <span className="sc-cell-media__arrow">→</span>
                  </a>
                )}
                {pragyan?.TextTwoLink && (
                  <a href={pragyan.TextTwoLink} target="_blank" rel="noopener noreferrer" className="sc-cell-media__link">
                    <span className="sc-cell-media__icon sc-cell-media__icon--orange">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M10 9l5 3-5 3V9z" />
                      </svg>
                    </span>
                    <span>
                      <strong>{pragyan?.TextTwo || "View Podcast"}</strong>
                      <small>Listen on Spotify</small>
                    </span>
                    <span className="sc-cell-media__arrow">→</span>
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ---- Research resources & publications (tabbed) ---- */}
        {researchRes?.Sections?.length > 0 && <TabbedDocs tabs={researchRes.Sections} eyebrow="Knowledge" title={researchRes?.title || "Resources & Events"} lead={researchRes?.description} />}
        {publications?.TabSections?.length > 0 && <TabbedDocs tabs={publications.TabSections} eyebrow="Research" title={publications?.title || "Publications"} />}

        {/* ---- Value Added — year-wise courses ---- */}
        {years.length > 0 && (
          <section className="sc-section">
            <SectionHead eyebrow="Curriculum" title={vacYears?.title || "Year Wise Courses"} />
            <div className="sc-cell-tabs__bar" role="tablist" aria-label="Course years">
              {years.map((yr: any, i: number) => (
                <button
                  key={yr.year || i}
                  type="button"
                  role="tab"
                  aria-selected={i === safeYear}
                  className={`sc-cell-tabs__btn${i === safeYear ? " is-active" : ""}`}
                  onClick={() => setVacYear(i)}
                >
                  {yr.year}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={safeYear}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="sc-cell-years"
              >
                {(years[safeYear]?.courses || []).map((c: any, j: number) => (
                  <div key={`${safeYear}-${j}`} className="sc-cell-years__card">
                    <span className="sc-cell-years__index">{String(j + 1).padStart(2, "0")}</span>
                    <h4>{c.name}</h4>
                    {c.duration && <span className="sc-cell-years__dur">{c.duration} hours</span>}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </section>
        )}

        {/* ---- Gallery ---- */}
        {gallery?.images?.length > 0 && (
          <section className="sc-section">
            <SectionHead eyebrow="Moments" title={gallery?.title || "Gallery"} />
            <motion.div className="sc-cell-gal" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
              {gallery.images.map((src: string, i: number) => (
                <motion.figure key={i} className="sc-cell-gal__item" variants={fadeUp}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${gallery.title || "Gallery"} ${i + 1}`} loading="lazy" />
                </motion.figure>
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CellPage;
