"use client";

import React, { useState, useRef, ReactNode, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AboutCourse from "./AboutCourse/AboutCourse";
import HodMessage from "./HodMessage";
import DepartmentFaculty from "./DepartmentFaculty";
import PeosPosPsos from "./PeosPosPsos/PeosPosPsos";
import VisionMission from "./VisionMission";
import Syllabus from "./Syllabus";

/* NCET tab icons (tabler-style, same as NCET detail page) */
const IconAbout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
);
const IconVision = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
const IconHod = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12" /><path d="M11 8l-3 3l3 3" /><path d="M16 11h-8" /></svg>
);
const IconFaculty = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
);
const IconPeo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /></svg>
);
const IconSyllabus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -14" /><path d="M9 5a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -14" /><path d="M5 8h4" /><path d="M9 16h4" /></svg>
);

const TAB_DEFS = [
  { id: "about", label: "About Department", Icon: IconAbout },
  { id: "vision", label: "Vision & Mission", Icon: IconVision },
  { id: "hod", label: "HOD's Message", Icon: IconHod },
  { id: "faculty", label: "Faculty", Icon: IconFaculty },
  { id: "peo", label: "PEO's, PO's & PSO's", Icon: IconPeo },
  { id: "syllabus", label: "Syllabus", Icon: IconSyllabus },
];

interface DepartmentTabsProps {
  /** URL slug segment, e.g. "masters-in-business-administration" */
  id: string;
  /** Normalized programme name (e.g. "masters in business administration") */
  programme: string;
  /** Active tab id, default "about" */
  tab?: string;
}

export default function DepartmentTabs({ id, programme, tab = "about" }: DepartmentTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(tab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hodAvailable, setHodAvailable] = useState<boolean | null>(null);
  const [programmeAvailable, setProgrammeAvailable] = useState<boolean | null>(null);
  const [syllabusAvailable, setSyllabusAvailable] = useState<boolean | null>(null);

  // Keep the active tab in sync with the URL segment
  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  // Hide tabs whose content is missing for the selected department
  const availableTabs = TAB_DEFS.filter((t) => {
    if (t.id === "hod") return hodAvailable !== false;
    if (t.id === "peo") return programmeAvailable !== false;
    if (t.id === "syllabus") return syllabusAvailable !== false;
    return true;
  });

  useEffect(() => {
    if (!availableTabs.some((t) => t.id === activeTab)) setActiveTab(availableTabs[0]?.id || "about");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hodAvailable, programmeAvailable, syllabusAvailable]);

  const activeLabel = availableTabs.find((t) => t.id === activeTab)?.label || "About Department";

  const handleTabChange = (tabId: string) => {
    setIsMobileMenuOpen(false);
    if (tabId === "about") {
      router.push(`/department/${id}`);
    } else {
      router.push(`/department/${id}/${tabId}`);
    }
  };

  const components: Record<string, ReactNode> = {
    about: (
      <Suspense fallback={<p>Loading...</p>}>
        <AboutCourse programme={programme} />
      </Suspense>
    ),
    vision: (
      <Suspense fallback={<p>Loading...</p>}>
        <VisionMission programme={programme} />
      </Suspense>
    ),
    hod: (
      <Suspense fallback={<p>Loading...</p>}>
        <HodMessage programme={programme} onHodContentCheck={setHodAvailable} />
      </Suspense>
    ),
    faculty: (
      <Suspense fallback={<p>Loading...</p>}>
        <DepartmentFaculty programme={programme} />
      </Suspense>
    ),
    peo: (
      <Suspense fallback={<p>Loading...</p>}>
        <PeosPosPsos programme={programme} onProgrammeContentCheck={setProgrammeAvailable} />
      </Suspense>
    ),
    syllabus: (
      <Suspense fallback={<p>Loading...</p>}>
        <Syllabus programme={programme} onSyllabusContentCheck={setSyllabusAvailable} />
      </Suspense>
    ),
  };

  return (
    <div className="departments-page-root dept-details-root">
      {/* Desktop pill tabs */}
      <div className="dept-tabs-desktop-container">
        <div className="dept-tabs-desktop-flex">
          <div className="dept-tabs-pill-box">
            {availableTabs.map((t) => (
              <button
                key={t.id}
                className={`dept-subpage-tab-btn ${activeTab === t.id ? "active-tab" : ""}`}
                onClick={() => handleTabChange(t.id)}
              >
                <t.Icon />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile trigger + drawer */}
      <div className="dept-tabs-mobile-container">
        <button className="dept-mobile-trigger-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <div className="dept-mobile-btn-left">
            <div className="dept-mobile-search-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
            </div>
            <div className="dept-mobile-btn-text">
              <p className="label-sub">Currently Viewing</p>
              <p className="label-main">{activeLabel}</p>
            </div>
          </div>
          <div className="dept-mobile-arrow-circle">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </button>

        {isMobileMenuOpen && (
          <div className="dept-mobile-overlay-drawer" style={{ zIndex: 1000 }}>
            <div className="dept-mobile-drawer-body">
              <button className="dept-mobile-drawer-close" onClick={() => setIsMobileMenuOpen(false)}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="dept-mobile-drawer-header">
                <p className="label-sub">Explore Department</p>
                <h2>Quick <br /><span className="text-orange">Navigation</span></h2>
              </div>
              <div className="dept-mobile-drawer-grid">
                {availableTabs.map((t) => (
                  <button
                    key={t.id}
                    className="dept-mobile-grid-btn"
                    onClick={() => handleTabChange(t.id)}
                  >
                    <div className="dept-mobile-grid-btn-icon">
                      <t.Icon />
                    </div>
                    <span className="dept-mobile-grid-btn-text">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab content */}
      <div className="dept-tab-content-container">
        {components[activeTab] || <p>Content not available.</p>}
      </div>

      {/* EXPLORE OTHER DEPARTMENTS SECTION */}
      <div className="dept-explore-other-section">
        <div className="explore-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        <div className="explore-container">
          <div className="explore-header-row">
            <div className="explore-title-block">
              <span className="explore-subtitle">ACADEMIC EXCELLENCE</span>
              <h2 className="explore-title">
                Explore Other <br />
                <span className="text-orange">Departments</span>
              </h2>
            </div>
            <div className="explore-btn-block">
              <Link href="/departments" className="view-all-btn">
                VIEW ALL DEPARTMENTS
                <svg className="explore-btn-arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              </Link>
            </div>
          </div>

          <div className="explore-cards-row">
            <Link href="/department/computer-application" className="explore-card-item" data-index="01">
              <div className="explore-card-top">
                <span className="explore-card-index">01</span>
                <span className="explore-card-chip">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="5" rx="1"></rect><path d="M5 4h-.5a2 2 0 0 0 -2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2 -2v-14a2 2 0 0 0 -2 -2h-.5"></path><path d="M8 11h8"></path><path d="M8 15h5"></path></svg>
                </span>
              </div>
              <span className="card-category">COMPUTING</span>
              <h4 className="card-dept-name">Computer Application</h4>
              <span className="explore-card-link">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              </span>
            </Link>
            <Link href="/department/masters-in-business-administration" className="explore-card-item" data-index="02">
              <div className="explore-card-top">
                <span className="explore-card-index">02</span>
                <span className="explore-card-chip">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path><path d="M16 21v-4a2 2 0 0 0 -2 -2h-4a2 2 0 0 0 -2 2v4"></path><path d="M17 17v-6"></path><path d="M7 17v-6"></path></svg>
                </span>
              </div>
              <span className="card-category">MANAGEMENT</span>
              <h4 className="card-dept-name">Master of Business Administration</h4>
              <span className="explore-card-link">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              </span>
            </Link>
            <Link href="/department/science" className="explore-card-item" data-index="03">
              <div className="explore-card-top">
                <span className="explore-card-index">03</span>
                <span className="explore-card-chip">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><path d="M20.2 20.2c2.04 -2.03.02 -7.36 -4.5 -11.9 -4.54 -4.52 -9.87 -6.54 -11.9 -4.5 -2.04 2.03 -.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5z"></path><path d="M15.7 15.7c4.52 -4.54 6.54 -9.87 4.5 -11.9 -2.03 -2.04 -7.36 -.02 -11.9 4.5 -4.52 4.54 -6.54 9.87 -4.5 11.9 2.03 2.04 7.36 .02 11.9 -4.5z"></path></svg>
                </span>
              </div>
              <span className="card-category">SCIENCE</span>
              <h4 className="card-dept-name">Science (B.Sc)</h4>
              <span className="explore-card-link">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
