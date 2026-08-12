"use client";

import React from "react";
import { motion } from "framer-motion";

const EASE = [0.23, 1, 0.32, 1] as const;

const Rise = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, transform: "translateY(26px)" }}
    whileInView={{ opacity: 1, transform: "translateY(0px)" }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, ease: EASE }}
  >
    {children}
  </motion.div>
);

const sp = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const STAT_ICONS: Record<string, React.ReactNode> = {
  volumes: (<svg {...sp}><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></svg>),
  issues: (<svg {...sp}><rect x="3" y="4.5" width="18" height="17" rx="2.5" /><path d="M16 2.5v4M8 2.5v4M3 10h18" /></svg>),
  stories: (<svg {...sp}><circle cx="9" cy="8" r="3.1" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M16 6.2a3 3 0 0 1 0 5.6" /><path d="M17 14.4A5.5 5.5 0 0 1 20.5 19" /></svg>),
};

const DISCOVER_ICONS: Record<string, React.ReactNode> = {
  chronicles: (<svg {...sp}><path d="m12 3 9 5H3l9-5Z" /><path d="M5 11v7M9.5 11v7M14.5 11v7M19 11v7" /><path d="M3 21h18" /></svg>),
  research: (<svg {...sp}><path d="M9 3h6M10 3v6l-5 8.5A2 2 0 0 0 6.8 21h10.4a2 2 0 0 0 1.8-3.5L14 9V3" /><path d="M7.5 15h9" /></svg>),
  spotlight: (<svg {...sp}><path d="m12 3 2.6 5.3 5.9.86-4.27 4.16 1 5.88L12 16.9l-5.23 2.3 1-5.88L2.5 9.16l5.9-.86z" /></svg>),
  faculty: (<svg {...sp}><path d="M3 4h18" /><path d="M4 4v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4" /><path d="M12 15v6M9 21h6" /><path d="m8 11 2.5-2.6 2 2L16 7" /></svg>),
};

const DISCOVER_ITEMS = [
  { icon: "chronicles", title: "Campus Chronicles", desc: "Moments and milestones from across departments." },
  { icon: "research", title: "Research Horizons", desc: "Deep-dives into cutting-edge research and innovation." },
  { icon: "spotlight", title: "Student Spotlight", desc: "Achievements, projects and voices that lead change." },
  { icon: "faculty", title: "Faculty Insights", desc: "Expert perspectives shaping education and industry." },
];

const SamashtiAbout = ({ data, editionCount }: any) => {
  const { year, descriptions } = data || {};
  const paragraphs: string[] = Array.isArray(descriptions)
    ? descriptions
    : String(descriptions || "")
        .split(/\n{2,}/)
        .map((s: string) => s.trim())
        .filter(Boolean);

  const headingLines = String(year || "Bridging Innovation, Knowledge & Excellence")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  const coverImg = "/images/samashti-page/edition.png";

  const stats = [
    { icon: "volumes", value: `${editionCount || 12}+`, label: "Volumes Published" },
    { icon: "issues", value: "4", label: "Issues Every Year" },
    { icon: "stories", value: "500+", label: "Campus Stories" },
  ];

  return (
    <section className="sms-am">
      <div className="container">
        <div className="sms-am__grid">
          <Rise className="sms-am__media">
            <div className="sms-am__cover">
              <img src={coverImg} alt="Nagarjuna Samashti magazine cover" loading="lazy" />
            </div>
          </Rise>
          <Rise className="sms-am__body">
            <span className="eyebrow-ed">About the Magazine</span>
            <h2 className="sms-am__title">
              {headingLines.map((l: string, i: number) => <span key={i}>{l}</span>)}
            </h2>
            {paragraphs.map((p: string, i: number) => (
              <p className="sms-am__text" key={i}>{p}</p>
            ))}
            <div className="sms-am__stats">
              {stats.map((s, i) => (
                <div className="sms-stat" key={i}>
                  <span className="sms-stat__icon">{STAT_ICONS[s.icon]}</span>
                  <span className="sms-stat__value">{s.value}</span>
                  <span className="sms-stat__label">{s.label}</span>
                </div>
              ))}
            </div>
          </Rise>
        </div>

        {/* What you'll discover */}
        <Rise>
          <div className="sms-disc">
            <h3 className="sms-disc__title">What you&apos;ll discover</h3>
            <div className="sms-disc__grid">
              {DISCOVER_ITEMS.map((it, i) => (
                <div className="sms-disc__item" key={i}>
                  <span className="sms-disc__icon">{DISCOVER_ICONS[it.icon]}</span>
                  <div className="sms-disc__text">
                    <h4>{it.title}</h4>
                    <p>{it.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
};

export default SamashtiAbout;
