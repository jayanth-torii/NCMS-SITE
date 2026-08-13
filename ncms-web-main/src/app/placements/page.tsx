"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";

import PageBanner from "@/components/PageBanner/PageBanner";
import placementData from "@/data-export/placement/data.json";
import { getPlacement } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

// ---- Motion presets -------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const Reveal = ({ children, className = "", ...rest }: any) => (
  <motion.div
    className={className}
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
    {...rest}
  >
    {children}
  </motion.div>
);

// Animated count-up for the stat band.
const StatNumber = ({ value }: { value: string }) => {
  const match = String(value).match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : String(value);
  const decimals = match && match[1].includes(".") ? 1 : 0;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));
  const [display, setDisplay] = useState(decimals ? "0.0" : "0");
  useEffect(() => rounded.on("change", (v) => setDisplay(v)), [rounded]);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, { duration: 1.6, ease: "easeOut" });
    return controls.stop;
  }, [inView, target, count]);
  return (
    <span ref={ref}>
      {display}
      <span>{suffix}</span>
    </span>
  );
};

const SectionHead = ({ eyebrow, children, lead }: any) => (
  <div className="placements-section__head">
    {eyebrow && <span className="placements-eyebrow">{eyebrow}</span>}
    <h2 className="placements-section__title">{children}</h2>
    {lead && <p className="plx-lead">{lead}</p>}
  </div>
);

// With \n as <br/>.
const withBreaks = (text: string) =>
  String(text || "")
    .split("\n")
    .map((line, i, a) => (
      <React.Fragment key={i}>
        {line}
        {i < a.length - 1 && <br />}
      </React.Fragment>
    ));

// ---- Icon maps (content stores a key; the SVG lives here) ------------------
const VMG_ICONS: Record<string, React.ReactNode> = {
  vision: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </>
  ),
  mission: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </>
  ),
  goal: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />,
};

const ACT_ICONS: Record<string, React.ReactNode> = {
  recruit: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </>
  ),
  training: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </>
  ),
  moU: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </>
  ),
};

const initials = (name = "") => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const CompanyLogo = ({ src, name }: { src?: string; name?: string }) => {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return <span className="plx-kp__fallback">{initials(name || "Partner")}</span>;
  return <img src={src} alt={name || ""} loading="lazy" onError={() => setFailed(true)} />;
};

const Placements = () => {
  const { data: liveData } = useLiveData(getPlacement, placementData as any);
  const d: any = liveData || (placementData as any).data || placementData;
  const reduce = useReducedMotion();

  const vmSection = d?.aboutVisionMission?.[0] || {};
  const about = vmSection.about || {};
  const vmg = (vmSection.visionMission?.sections || []).map((s: any) => ({
    title: s.title,
    text: s.description,
    key: s.title.toLowerCase().includes("vision") ? "vision" : s.title.toLowerCase().includes("mission") ? "mission" : "goal",
  }));
  const activities = d?.activities?.sections || [];
  const recruiting = d?.recruttingPartners || [];
  const knowledgePartners = d?.knowledgePartners?.partners || [];
  const collaborationImages = d?.collaboration?.images || [];
  const collaborationTitle = d?.collaboration?.title || "Our Collaboration";

  // Derived stats (real data counts — always honest)
  const stats = [
    { value: String(recruiting.length), label: "Recruiting Partners" },
    { value: String(knowledgePartners.length), label: "Knowledge Partners" },
    { value: String(collaborationImages.length), label: "Industry Collaborations" },
    { value: String(activities.length), label: "Activity Programs" },
  ];

  // Double-marquee rows for recruiters.
  const RECRUITER_ROWS = [
    recruiting.filter((_: any, i: number) => i % 2 === 0),
    recruiting.filter((_: any, i: number) => i % 2 === 1),
  ];

  // ---- Collaboration swap gallery state ----
  const [active, setActive] = useState(0);
  const ordered = [collaborationImages[active], ...collaborationImages.filter((_: string, i: number) => i !== active)];
  const selectCollab = (i: number) => setActive(i);

  return (
    <div className="placements-page">
      <PageBanner
        title={d?.banner?.title || "Placements"}
        eyebrow="Training & Placement Cell"
        subtitle="Building industry-ready careers through training, recruitment drives and enduring corporate partnerships."
        className="placements-page-banner"
        image={d?.banner?.image}
      />

      <div className="container placements-content">
        {/* ---- Impact stats ---- */}
        <Reveal className="container placements-statband-wrap">
          <div className="placements-statband">
            {stats.map((stat, i) => (
              <div key={i} className="placements-statband__item">
                <div className="placements-statband__value">
                  <StatNumber value={stat.value} />
                </div>
                <div className="placements-statband__label">{withBreaks(stat.label)}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ---- About Placements ---- */}
        <Reveal className="placements-section">
          <div className="placements-about">
            <span className="placements-eyebrow">Placement Cell</span>
            <h2 className="placements-section__title">
              {about.title || "Welcome to"} <span>Placements</span>
            </h2>
            {(about.descriptions || []).map((para: string, i: number) => (
              <p key={i} className="placements-about__desc" style={{ marginBottom: "1rem" }}>
                {withBreaks(para)}
              </p>
            ))}
          </div>
        </Reveal>

        {/* ---- Vision / Mission cards ---- */}
        {vmg.length > 0 && (
          <motion.section
            className="placements-section placements-vmg"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {vmg.map((card: any, i: number) => (
              <motion.div key={i} className="placements-vmg__card" variants={fadeUp}>
                <div className="placements-vmg__icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {VMG_ICONS[card.key] || VMG_ICONS.goal}
                  </svg>
                </div>
                <h3 className="placements-vmg__title">{card.title}</h3>
                <p className="placements-vmg__text">{withBreaks(card.text)}</p>
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* ---- Activities ---- */}
        {activities.length > 0 && (
          <Reveal className="placements-section placements-section--center">
            <SectionHead eyebrow="What we do" lead="A year-round engine that keeps students industry-ready and companies connected to campus talent.">
              Placement <span>Activities</span>
            </SectionHead>
            <motion.div
              className="plx-act"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {activities.map((section: any, i: number) => (
                <motion.article key={section.title} className="plx-act__card" variants={fadeUp}>
                  <span className="plx-act__dots" aria-hidden="true" />
                  <span className="plx-act__glow" aria-hidden="true" />
                  <span className="plx-act__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="plx-act__icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      {ACT_ICONS[i === 0 ? "recruit" : i === 1 ? "training" : "moU"]}
                    </svg>
                  </div>
                  <h3 className="plx-act__title">{section.title}</h3>
                  <ul className="plx-act__list">
                    {(section.descriptions || []).map((item: string, j: number) => (
                      <li key={j} className="plx-act__item">
                        <span className="plx-act__dot" aria-hidden="true" />
                        <span>{withBreaks(item)}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </motion.div>
          </Reveal>
        )}

        {/* ---- Top Recruiters ---- */}
        <Reveal className="placements-section placements-section--center placements-recruiters-section">
          <SectionHead eyebrow="Trusted by industry" lead={`${recruiting.length} companies across sectors hire our graduates year after year.`}>
            Our Recruiting <span>Partners</span>
          </SectionHead>
          <div className="placements-recruiters-v2">
            <div className="placements-recruiters-v2__fade placements-recruiters-v2__fade--left" aria-hidden="true" />
            <div className="placements-recruiters-v2__fade placements-recruiters-v2__fade--right" aria-hidden="true" />
            {RECRUITER_ROWS.map((row: any[], rowIdx: number) => (
              <div key={rowIdx} className="placements-recruiters-v2__row">
                <div className={`placements-recruiters-v2__track${rowIdx === 1 ? " is-reverse" : ""}`}>
                  {[...row, ...row].map((logo, i) => (
                    <div key={`${logo.title}-${rowIdx}-${i}`} className="placements-recruiters-v2__logo" title={logo.title}>
                      <img src={logo.image} alt={logo.title} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ---- Knowledge Partners ---- */}
        {knowledgePartners.length > 0 && (
          <Reveal className="placements-section placements-section--center">
            <SectionHead eyebrow="Learning alliance" lead={d?.knowledgePartners?.description || "Our knowledge partners enrich the learning ecosystem with expertise and resources."}>
              Meet our Knowledge <span>Partners</span>
            </SectionHead>
            <motion.div
              className="plx-kp"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {knowledgePartners.map((src: string, i: number) => (
                <motion.div key={i} className="plx-kp__card" variants={fadeUp}>
                  <CompanyLogo src={src} name={`Knowledge Partner ${i + 1}`} />
                </motion.div>
              ))}
            </motion.div>
          </Reveal>
        )}

        {/* ---- Collaboration swap gallery ---- */}
        {collaborationImages.length > 0 && (
          <Reveal className="placements-section placements-section--center plx-collab">
            <SectionHead eyebrow="Networking" lead="Working hand-in-hand with organisations across industries to create real opportunities for students.">
              {collaborationTitle.split(" ")[0]} <span>{collaborationTitle.split(" ").slice(1).join(" ")}</span>
            </SectionHead>
            <div className="plx-collab__rail" role="tablist" aria-label="Collaborations">
              {collaborationImages.slice(0, 5).map((src: string, i: number) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  className={`plx-collab__partner${i === active ? " is-active" : ""}`}
                  onClick={() => selectCollab(i)}
                >
                  <span className="plx-collab__partner-thumb">
                    <img src={src} alt="" loading="lazy" />
                  </span>
                  <span className="plx-collab__partner-txt">
                    <strong>Partner {String(i + 1).padStart(2, "0")}</strong>
                    <span>collaboration</span>
                  </span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="plx-collab__grid"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.18 } }}
                transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                {ordered.slice(0, 5).map((src: string, pos: number) => {
                  const big = pos === 0;
                  const idx = collaborationImages.indexOf(src);
                  return (
                    <motion.figure
                      layout
                      key={src}
                      transition={reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className={`plx-collab__card${big ? " is-big" : ""}`}
                      onClick={() => !big && selectCollab(idx)}
                      role={big ? undefined : "button"}
                      tabIndex={big ? -1 : 0}
                    >
                      <img className="plx-collab__bg" src={src} alt="" aria-hidden="true" loading="lazy" />
                      <img className="plx-collab__img" src={src} alt={`Collaboration ${pos + 1}`} loading="lazy" />
                      <figcaption className="plx-collab__cap">
                        <span className="plx-collab__tag">Collaboration {String(pos + 1).padStart(2, "0")}</span>
                        <span className="plx-collab__text">{collaborationTitle}</span>
                      </figcaption>
                      {!big && <span className="plx-collab__hint" aria-hidden="true">＋</span>}
                    </motion.figure>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </Reveal>
        )}

        {/* ---- CTA ---- */}
        <Reveal className="placements-section placements-cta">
          <div className="placements-cta__glow placements-cta__glow--1" />
          <div className="placements-cta__glow placements-cta__glow--2" />
          <div className="placements-cta__inner">
            <div className="placements-cta__copy">
              <h2 className="placements-cta__title">
                Dream it. Train it. <span>Place it.</span>
              </h2>
              <p className="placements-cta__text">
                Join a placement ecosystem that has placed hundreds of graduates with the country&apos;s leading organisations.
              </p>
            </div>
            <a href="/apply-now" className="placements-cta__btn">
              Apply Now
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Placements;
