"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StudentCenterContent from "@/app/Data/StudentCenterContent";

type Tab = "Statutory Cells" | "Academic Enrichment" | "Community Services";

// Map child slugs -> their parent tab
const CHILD_TO_TAB: Record<string, Tab> = {
  // Statutory Cells
  "anti-ragging-cell": "Statutory Cells",
  "anti-sexual-harassment-cell": "Statutory Cells",
  "grievenvance-redressal-cell": "Statutory Cells",
  "grievance-redressal-cell": "Statutory Cells",
  "sc-st-obc-cell": "Statutory Cells",
  "unity-council": "Statutory Cells",
  "unity-council-equal-opportunity-cell": "Statutory Cells",
  "human-rights-cell": "Statutory Cells",

  // Academic Enrichment
  "value-added-programs": "Academic Enrichment",
  "ed-cell": "Academic Enrichment",
  "research-cell": "Academic Enrichment",
  "library": "Academic Enrichment",
  "commerce-forum": "Academic Enrichment",
  "nptel-local-chapter": "Academic Enrichment",
  "pragyan-science-forum": "Academic Enrichment",

  // Community Services
  "nss": "Community Services",
  "cultural-committee": "Community Services",
  "ncc": "Community Services",
  "sakhi-samrudhi-women-empowerment-cell": "Community Services",
  "kala-chaitanya": "Community Services",
};

const parentSlugToTab: Record<string, Tab> = {
  "statutory-cells": "Statutory Cells",
  "academic-enrichment": "Academic Enrichment",
  "community-services": "Community Services",
};

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  "Statutory Cells": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  "Academic Enrichment": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
      <path d="M22 10v6" />
    </svg>
  ),
  "Community Services": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
};

const CARD_ICONS: Record<Tab, React.ReactNode[]> = {
  "Statutory Cells": [
    <svg key="s1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    <svg key="s2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>,
    <svg key="s3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    <svg key="s4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0116 0v1" /></svg>,
    <svg key="s5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01" /></svg>,
    <svg key="s6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
  ],
  "Academic Enrichment": [
    <svg key="a1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" /></svg>,
    <svg key="a2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
    <svg key="a3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>,
    <svg key="a4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
    <svg key="a5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
    <svg key="a6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /></svg>,
    <svg key="a7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>,
  ],
  "Community Services": [
    <svg key="c1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    <svg key="c2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7v10M6 7v10M10 7v10M14 7v10M18 7v10M22 7v10" /></svg>,
    <svg key="c3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.35-9.5-8A5.5 5.5 0 0112 6.5 5.5 5.5 0 0121.5 13c-2.5 3.65-9.5 8-9.5 8z" /></svg>,
    <svg key="c4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0116 0v1" /></svg>,
    <svg key="c5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
  ],
};

const TAB_META: Record<Tab, { sub: string }> = {
  "Statutory Cells": { sub: "Committees that safeguard student rights & campus safety" },
  "Academic Enrichment": { sub: "Programmes that go beyond the classroom" },
  "Community Services": { sub: "Cells that build character through service" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

const KnowEverything = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState<Tab>("Statutory Cells");

  // Decide tab from URL hash OR pathname (parent or child) before writing hash
  useEffect(() => {
    // 1) If hash is present and valid, prefer it
    const rawHash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
    const hash = decodeURIComponent(rawHash);
    if (StudentCenterContent.tabsList.includes(hash as Tab)) {
      setSelectedTab(hash as Tab);
      return;
    }

    // 2) Derive from pathname
    const segments = pathname.split("/").filter(Boolean);

    // Parent present?
    for (const seg of segments) {
      if (parentSlugToTab[seg]) {
        setSelectedTab(parentSlugToTab[seg]);
        return;
      }
    }
    // Child present?
    for (const seg of segments) {
      if (CHILD_TO_TAB[seg]) {
        setSelectedTab(CHILD_TO_TAB[seg]);
        return;
      }
    }

    // 3) Fallback
    setSelectedTab("Statutory Cells");
  }, [pathname]);

  // Keep URL hash in sync with the selected tab (but don't overwrite a correct hash)
  useEffect(() => {
    const desired = `#${selectedTab}`;
    if (typeof window !== "undefined" && window.location.hash !== desired) {
      window.location.hash = selectedTab;
    }
  }, [selectedTab]);

  const handleProgrammeClick = (programmePath: string) => {
    if (!selectedTab) return;
    const tabPath = selectedTab.toLowerCase().replace(/\s+/g, "-");
    router.push(`/student-center/${tabPath}/${programmePath}`);
  };

  const programmes = StudentCenterContent.programmeOptions[selectedTab];

  return (
    <div className="sc-hub">
      <span className="sc-hub__bg" aria-hidden="true" />

      <div className="sc-hub__head">
        <div>
          <span className="sc-eyebrow">Know Everything About</span>
          <h2 className="sc-title">
            Student <span>Center</span>
          </h2>
        </div>
      </div>

      <p className="sc-hub__intro">{StudentCenterContent.description}</p>

      {/* Animated tab menu */}
      <div className="sc-tabs" role="tablist" aria-label="Student center sections">
        {StudentCenterContent.tabsList.map((tab) => {
          const isActive = selectedTab === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`sc-tab${isActive ? " is-active" : ""}`}
              onClick={() => setSelectedTab(tab as Tab)}
            >
              {isActive && <motion.span layoutId="sc-tab-pill" className="sc-tab__pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              {TAB_ICONS[tab as Tab]}
              {tab}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="sc-hub__panel">
        <AnimatePresence mode="wait">
          {selectedTab && (
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="sc-hub__head" style={{ marginBottom: "18px" }}>
                <div>
                  <span className="sc-eyebrow">Explore</span>
                  <h3 className="sc-title" style={{ fontSize: "clamp(22px, 2.6vw, 28px)" }}>
                    {selectedTab}
                  </h3>
                  <p className="sc-lead" style={{ margin: "8px 0 0", maxWidth: "none", textAlign: "left" }}>
                    {TAB_META[selectedTab].sub}
                  </p>
                </div>
              </div>

              <motion.div
                className="sc-prog-grid"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              >
                {programmes.length > 0 ? (
                  programmes.map((programme: any, index: number) => {
                    const icons = CARD_ICONS[selectedTab] || [];
                    return (
                      <motion.button
                        key={programme.path}
                        type="button"
                        variants={fadeUp}
                        className="sc-prog-item"
                        onClick={() => handleProgrammeClick(programme.path)}
                      >
                        <span className="sc-prog-item__icon">{icons[index % icons.length]}</span>
                        <span className="sc-prog-item__txt">
                          <span className="sc-prog-item__name">{programme.name}</span>
                          <span className="sc-prog-item__sub">{selectedTab}</span>
                        </span>
                        <span className="sc-prog-item__arrow">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </motion.button>
                    );
                  })
                ) : (
                  <p className="sc-prog-empty">Programmes are being updated.</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KnowEverything;
