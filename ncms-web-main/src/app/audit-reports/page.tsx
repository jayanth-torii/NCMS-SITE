"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, ArrowRight, CalendarCheck2, ShieldCheck } from "lucide-react";

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

const AuditReports = () => {
  const { data: liveData } = useLiveData(getAuditReport, auditReportsData as any);
  const d: any = liveData || (auditReportsData as any).data || auditReportsData;

  const banner = d?.banner || {};
  const audit = d?.auditReports || {};
  const sections: any[] = audit?.sections || [];

  return (
    <main className="aud-page">
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

          <div className="aud-timeline">
            {sections.map((s: any, i: number) => (
              <Rise key={s?.id || i} delay={(i % 5) * 0.05} className="aud-item">
                <span className="aud-item__dot" />
                <a
                  href={s?.pdf || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aud-item__card"
                >
                  <span className="aud-item__icon">
                    {i % 3 === 0 ? <CalendarCheck2 /> : i % 3 === 1 ? <FileText /> : <ShieldCheck />}
                  </span>
                  <span className="aud-item__title">{s?.title}</span>
                  <span className="aud-item__btn">
                    View Report <ArrowRight />
                  </span>
                </a>
              </Rise>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuditReports;
