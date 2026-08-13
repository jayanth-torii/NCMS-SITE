"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, ArrowRight, CalendarCheck2, ShieldCheck, Info } from "lucide-react";

import PageBanner from "@/components/PageBanner/PageBanner";
import highlight from "@/components/HomeNCET/highlight";

import auditReportsData from "@/data-export/audit-report/data.json";
import { getAuditReport } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const Rise = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, transform: "translateY(26px)" }}
    whileInView={{ opacity: 1, transform: "translateY(0px)" }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, ease: EASE, delay }}
  >
    {children}
  </motion.div>
);

/* Fullscreen decorative background — shades + geometric shapes (same system as department pages) */
const AuditDecor = () => (
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

const AuditReports = () => {
  const { data: liveData } = useLiveData(getAuditReport, auditReportsData as any);
  const d: any = liveData || (auditReportsData as any).data || auditReportsData;

  const banner = d?.banner || {};
  const audit = d?.auditReports || {};
  const sections: any[] = audit?.sections || [];

  const years = sections
    .map((s: any) => (s?.title || "").match(/\d{4}/)?.[0])
    .filter(Boolean)
    .map(Number)
    .sort((a: number, b: number) => b - a);

  const firstYear = years.length ? years[0] : "";
  const lastYear = years.length ? years[years.length - 1] : "";

  return (
    <main className="aud-page">
      <AuditDecor />

      <div className="aud-page-content">
        <PageBanner
          title={banner?.title || "Audit Reports"}
          eyebrow="Transparency & Accountability"
          subtitle="Annual statutory audit reports of Nagarjuna College of Management Studies, published in the interest of transparency."
          image={banner?.image || "/images/audit_reports_banner_ebc0b60d1c.png"}
        />

        <section className="aud-main">
          <div className="container">
            <Rise className="aud-intro">
              <span className="aud-intro__eyebrow">
                <i /> Annual Audits
              </span>
              <h1 className="aud-intro__title">
                {audit?.title ? highlight(audit.title, "Audit") : "Audit Reports"}
              </h1>
              <p className="aud-intro__desc">
                Every year, NCMS undergoes a comprehensive statutory audit. Download the
                audited financial reports and statements for each academic year.
              </p>
            </Rise>

            {/* Stats band */}
            <Rise delay={0.06} className="aud-stats">
              <div className="aud-stat">
                <span className="aud-stat__num">
                  {sections.length}<em>+</em>
                </span>
                <span className="aud-stat__label">Annual Reports</span>
              </div>
              <div className="aud-stat">
                <span className="aud-stat__num">
                  {firstYear && lastYear ? `${lastYear}–${firstYear}` : "—"}
                </span>
                <span className="aud-stat__label">Years Covered</span>
              </div>
              <div className="aud-stat">
                <span className="aud-stat__num">100<em>%</em></span>
                <span className="aud-stat__label">Statutory Audits</span>
              </div>
              <div className="aud-stat">
                <span className="aud-stat__num">
                  <em>A</em>
                </span>
                <span className="aud-stat__label">Assured Quality</span>
              </div>
            </Rise>

            {/* Year cards grid */}
            <div className="aud-grid">
              {sections.map((s: any, i: number) => (
                <Rise key={s?.id || i} delay={(i % 3) * 0.07} className="aud-card-wrap">
                  <a
                    href={s?.pdf || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aud-card"
                  >
                    <div className="aud-card__top">
                      <span className="aud-card__icon">
                        {i % 3 === 0 ? <CalendarCheck2 /> : i % 3 === 1 ? <FileText /> : <ShieldCheck />}
                      </span>
                      <span className="aud-card__badge">Statutory Audit</span>
                    </div>
                    <h3 className="aud-card__year">{s?.title || `Report ${i + 1}`}</h3>
                    <p className="aud-card__sub">
                      Audited financial statements of Nagarjuna College of Management Studies.
                    </p>
                    <span className="aud-card__btn">
                      View Report <ArrowRight />
                    </span>
                  </a>
                </Rise>
              ))}
            </div>

            <Rise delay={0.1} className="aud-note">
              <Info />
              All reports are hosted as official PDFs and open in a new tab for easy viewing and download.
            </Rise>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuditReports;
