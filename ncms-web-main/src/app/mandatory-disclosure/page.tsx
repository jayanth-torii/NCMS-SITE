"use client";

import React, { useMemo, useState } from "react";
import { FileText, ChevronRight, ArrowRight, Scale, BookMarked, FileCheck2, Landmark, Sprout } from "lucide-react";

import PageBanner from "@/components/PageBanner/PageBanner";

import mandatoryDisclosureData from "@/data-export/mandatory-disclosure/data.json";
import { getMandatoryDisclosure } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

/* ---------------- small presentational pieces ---------------- */
const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6l-6 6" />
  </svg>
);

const PdfCard = ({ title, pdf, index = 0 }: { title: string; pdf: string; index?: number }) => (
  <a href={pdf} target="_blank" rel="noopener noreferrer" className={`mdp-card mdp-fade-in mdp-delay-${index % 8}`}>
    <div className="mdp-card__icon-wrap">
      <FileText />
    </div>
    <div className="mdp-card__content">
      <span className="mdp-card__title">{title}</span>
    </div>
    <div className="mdp-card__footer">
      <span className="mdp-card__action-text">View Document</span>
      <div className="mdp-card__arrow-wrap">
        <ArrowIcon />
      </div>
    </div>
  </a>
);

const DocumentRow = ({ title, pdf, index = 0 }: { title: string; pdf: string; index?: number }) => (
  <a href={pdf} target="_blank" rel="noopener noreferrer" className={`mdp-docrow mdp-fade-in mdp-delay-${index % 8}`}>
    <div className="mdp-docrow__left">
      <div className="mdp-docrow__icon">
        <FileText />
      </div>
      <span className="mdp-docrow__title">{title}</span>
    </div>
    <div className="mdp-docrow__btn">
      View <ChevronRight size="12px" />
    </div>
  </a>
);

/* ---------------- icons per category ---------------- */
const CAT_ICONS: Record<string, React.ReactNode> = {
  policies: <Scale size={15} />,
  quickLinks: <BookMarked size={15} />,
  affiliationOrders: <Landmark size={15} />,
  reports: <FileCheck2 size={15} />,
  campusInitiatives: <Sprout size={15} />,
};

/* Fullscreen decorative background — shades + geometric shapes (same system as department pages) */
const MdpDecor = () => (
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

const MandatoryDisclosure = () => {
  const { data: liveData } = useLiveData(getMandatoryDisclosure, mandatoryDisclosureData as any);
  const d: any = liveData || (mandatoryDisclosureData as any).data || mandatoryDisclosureData;

  const banner = d?.banner || {};
  const policies = d?.policies || {};
  const quickLinks = d?.quickLinks || {};
  const affiliationOrders = d?.affiliationOrders || {};
  const reports = d?.reports || {};
  const campusInitiatives = d?.campusInitiatives || {};

  const categories = useMemo(
    () => [
      { id: "policies", label: "Policy Documents", title: "Policy Documents", desc: "Core institutional policies and mandatory disclosures." },
      { id: "quickLinks", label: "Quick Links", title: "Quick Links", desc: "Accreditations, affiliations and key disclosure documents at a glance." },
      { id: "affiliationOrders", label: "Affiliation Orders", title: "Affiliation Orders", desc: "University affiliation orders across academic years." },
      { id: "reports", label: "Reports", title: "Reports", desc: "LOA / EOA inspection reports and committee submissions." },
      { id: "campusInitiatives", label: "Campus Initiatives", title: "Campus Initiatives", desc: "Campus-level initiatives and their supporting documents." },
    ],
    []
  );

  const [activeCategory, setActiveCategory] = useState("policies");
  const [showAllPolicies, setShowAllPolicies] = useState(false);

  const active = categories.find((c) => c.id === activeCategory) || categories[0];

  const renderContent = () => {
    switch (activeCategory) {
      case "policies": {
        const all = policies?.sections || [];
        const displayed = showAllPolicies ? all : all.slice(0, 6);
        return (
          <div className="mdp-fade-up">
            <div className="mdp-content__header">
              <h2>{active.title}</h2>
              <p>{active.desc}</p>
            </div>
            <div className="mdp-grid">
              {displayed.map((s: any, i: number) => (
                <PdfCard key={s?.id || i} title={s?.title} pdf={s?.pdf} index={i} />
              ))}
            </div>
            {all.length > 6 && (
              <div className="mdp-more">
                <button type="button" onClick={() => setShowAllPolicies((v) => !v)}>
                  {showAllPolicies ? "Show Less" : `Load More (${all.length - 6} more)`}
                </button>
              </div>
            )}
          </div>
        );
      }
      case "quickLinks": {
        const links = quickLinks?.sections || [];
        return (
          <div className="mdp-fade-up">
            <div className="mdp-content__header">
              <h2>{active.title}</h2>
              <p>{active.desc}</p>
            </div>
            <div className="mdp-quick">
              {quickLinks?.image && (
                <div className="mdp-quick__media">
                  <img src={quickLinks.image} alt="Quick Links" />
                </div>
              )}
              <div className="mdp-doclist">
                {links.map((s: any, i: number) => (
                  <DocumentRow key={s?.id || i} title={s?.title} pdf={s?.pdf} index={i} />
                ))}
              </div>
            </div>
          </div>
        );
      }
      case "affiliationOrders": {
        const all = affiliationOrders?.sections || [];
        return (
          <div className="mdp-fade-up">
            <div className="mdp-content__header">
              <h2>{active.title}</h2>
              <p>{active.desc}</p>
            </div>
            <div className="mdp-doclist">
              {all.map((s: any, i: number) => (
                <DocumentRow key={s?.id || i} title={s?.title} pdf={s?.pdf} index={i} />
              ))}
            </div>
          </div>
        );
      }
      case "reports": {
        const all = reports?.sections || [];
        return (
          <div className="mdp-fade-up">
            <div className="mdp-content__header">
              <h2>{active.title}</h2>
              <p>{active.desc}</p>
            </div>
            <div className="mdp-doclist">
              {all.map((s: any, i: number) => (
                <DocumentRow key={s?.id || i} title={s?.title} pdf={s?.pdf} index={i} />
              ))}
            </div>
          </div>
        );
      }
      case "campusInitiatives": {
        const all = campusInitiatives?.sections || [];
        return (
          <div className="mdp-fade-up">
            <div className="mdp-content__header">
              <h2>{active.title}</h2>
              <p>{active.desc}</p>
            </div>
            <div className="mdp-doclist">
              {all.map((s: any, i: number) => (
                <DocumentRow key={s?.id || i} title={s?.title} pdf={s?.pdf} index={i} />
              ))}
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <main className="mdp-page">
      <MdpDecor />

      <div className="mdp-page-content">
      <PageBanner
        title={banner?.title || "Mandatory Disclosure"}
        eyebrow="Transparency & Compliance"
        subtitle="NCMS maintains full transparency and compliance with all governing bodies, ensuring the highest standards of education."
        image={banner?.image || "/images/mandatory_disclosure_banner_f845d5671c.png"}
      />

      <section className="mdp-main">
        <div className="mdp-main__container mdp-dashboard">
          {/* Sidebar Navigation */}
          <aside className="mdp-sidebar mdp-fade-up mdp-delay-0">
            <h3 className="mdp-sidebar__title">Categories</h3>
            <nav className="mdp-nav">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`mdp-nav__link ${activeCategory === cat.id ? "is-active" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span>
                    {CAT_ICONS[cat.id]}
                    {cat.label}
                  </span>
                  <ArrowRight size="13px" />
                </button>
              ))}
            </nav>
          </aside>

          {/* Dynamic Content Area */}
          <section className="mdp-content mdp-fade-up mdp-delay-1">{renderContent()}</section>
        </div>
      </section>
      </div>
    </main>
  );
};

export default MandatoryDisclosure;
