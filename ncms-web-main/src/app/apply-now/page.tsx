"use client";

import React from "react";
import { motion } from "framer-motion";

import PageBanner from "@/components/PageBanner/PageBanner";
import PageDecor from "@/components/ui/PageDecor";
import AdmissionsInfo from "@/components/ApplyNow/AdmissionsInfo";
import QueryForm from "@/components/ApplyNow/QueryForm";

import applyNowData from "@/data-export/apply-now/data.json";
import { getApplyNow } from "@/services/data.service";
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

const ApplyNow = () => {
  const { data: liveData } = useLiveData(getApplyNow, applyNowData as any);
  const d: any = (liveData as any)?.data || liveData || (applyNowData as any)?.data || applyNowData || {};

  const banner = d?.BannerSection || {};
  const content = d?.Content || {};

  return (
    <main className="apn-page">
      <PageDecor />

      <PageBanner
        eyebrow="Admissions 2025-26"
        title={content?.title || banner?.title || "Apply Now"}
        subtitle="Take the first step toward a future-ready career at NCMS. Submit your request and our admissions team will reach out to guide you."
        image={banner?.image || "/images/apply_now_banner_ba177d3cc6.png"}
      />

      <section className="apn-main">
        <div className="container">
          <div className="apn-grid">
            <Rise>
              <AdmissionsInfo />
            </Rise>
            <Rise delay={0.1}>
              <QueryForm />
            </Rise>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ApplyNow;
