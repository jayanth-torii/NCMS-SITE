"use client";

import React from "react";
import Link from "next/link";
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
const CTA_ICONS: Record<string, React.ReactNode> = {
  book: (<svg {...sp}><path d="M12 6.4C10.8 5.6 9.2 5.2 7.5 5.2S4.2 5.6 3 6.4v13c1.2-.8 2.8-1.2 4.5-1.2s3.3.4 4.5 1.2m0-13c1.2-.8 2.8-1.2 4.5-1.2s3.3.4 4.5 1.2v13c-1.2-.8-2.8-1.2-4.5-1.2s-3.3.4-4.5 1.2m0-13v13" /></svg>),
  community: (<svg {...sp}><circle cx="9" cy="8" r="3.1" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M16 6.2a3 3 0 0 1 0 5.6" /><path d="M17 14.4A5.5 5.5 0 0 1 20.5 19" /></svg>),
};

const SamashtiJoin = () => {
  const browseEditions = () => {
    const el = document.getElementById("editions");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="sms-join">
      <div className="container">
        <Rise>
          <div className="sms-join__box">
            <div className="sms-join__intro">
              <span className="sms-join__eyebrow">Be Part of the Story</span>
              <h2 className="sms-join__title">Share. Inspire. Connect.</h2>
              <p className="sms-join__text">
                Have an achievement, idea, or campus moment worth sharing? We&apos;d love to hear from you.
              </p>
              <Link href="/contact-us" className="sms-join__cta">Submit a Story</Link>
            </div>
            <div className="sms-join__links">
              <div className="sms-join__link">
                <span className="sms-join__link-icon">{CTA_ICONS.book}</span>
                <div className="sms-join__link-body">
                  <h4>Browse All Editions</h4>
                  <p>Explore every volume of Samashti magazine.</p>
                  <button type="button" className="sms-join__link-btn" onClick={browseEditions}>View All Editions</button>
                </div>
              </div>
              <div className="sms-join__link">
                <span className="sms-join__link-icon">{CTA_ICONS.community}</span>
                <div className="sms-join__link-body">
                  <h4>Join the Samashti Community</h4>
                  <p>Stay connected and never miss a new release.</p>
                  <Link href="/contact-us" className="sms-join__link-btn">Subscribe Now</Link>
                </div>
              </div>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
};

export default SamashtiJoin;
