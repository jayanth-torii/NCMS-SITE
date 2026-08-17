"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, ArrowRight, GraduationCap, UserRound, FileText,
  ExternalLink, MonitorSmartphone, Lock, ShieldCheck, CheckCircle2, LogIn,
  ClipboardList, UserCheck, BadgeCheck,
} from "lucide-react";

import PageBanner from "@/components/PageBanner/PageBanner";
import PageDecor from "@/components/ui/PageDecor";
import highlight from "@/components/HomeNCET/highlight";

import UUCMSData from "@/data-export/uucms-content/data.json";
import { getUucms } from "@/services/data.service";
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

// per-card icons: Candidate Registration, Student Login, plus fallbacks
const CARD_META: { icon: React.ComponentType<any>; label: string }[] = [
  { icon: ClipboardList, label: "Registration" },
  { icon: UserCheck, label: "Student Access" },
  { icon: BadgeCheck, label: "Candidate" },
];

const UUCMS = () => {
  const { data: liveData } = useLiveData(getUucms, UUCMSData as any);
  const d: any = liveData || (UUCMSData as any).data || UUCMSData;

  const banner = d?.banner || {};
  const manual = d?.manualSection || {};
  const portals: any[] = d?.loginPortals || [];

  const headerPortal = portals[0] || {};
  const loginCards = portals.slice(1);

  return (
    <main className="uuc-page">
      <PageDecor />

      <PageBanner
        title={banner?.title || "UUCMS"}
        eyebrow="University & College Management System"
        subtitle="Karnataka State Universities' unified portal for online applications, candidate registration and student services."
        image={banner?.image || "/images/uucms_banner_1_61538c9f81.png"}
      />

      {/* ---- Intro ---- */}
      <section className="uuc-intro">
        <div className="container">
          <Rise className="uuc-intro__inner">
            <span className="uuc-intro__eyebrow">
              <i /> Unified Portal
            </span>
            <h1 className="uuc-intro__title">
              {highlight("University & College Management System", "UUCMS")}
            </h1>
            <p className="uuc-intro__desc">
              {headerPortal?.description ||
                "Access the UUCMS portal for online applications, candidate registration and student login."}
            </p>
            <div className="uuc-chips">
              <span className="uuc-chip">
                <Lock /> Secure Login
              </span>
              <span className="uuc-chip">
                <CheckCircle2 /> Online Applications
              </span>
              <span className="uuc-chip">
                <ShieldCheck /> Govt. of Karnataka
              </span>
            </div>
          </Rise>
        </div>
      </section>

      {/* ---- Student Manual hero ---- */}
      {manual?.pdf && (
        <section className="container">
          <Rise>
            <div className="uuc-manual">
              <span className="uuc-manual__orb uuc-manual__orb--1" />
              <span className="uuc-manual__orb uuc-manual__orb--2" />
              <div className="uuc-manual__grid">
                <div>
                  <span className="uuc-manual__eyebrow">
                    <BookOpen /> Student Manual
                  </span>
                  <h2 className="uuc-manual__title">{manual?.title || "Student Manual"}</h2>
                  {manual?.description && <p className="uuc-manual__desc">{manual.description}</p>}
                  <ul className="uuc-manual__features">
                    <li className="uuc-manual__feature">
                      Step-by-step guide for online student applications
                    </li>
                    <li className="uuc-manual__feature">
                      Registration, document upload &amp; fee payment made simple
                    </li>
                    <li className="uuc-manual__feature">
                      Official UUCMS procedure published by the university
                    </li>
                  </ul>
                  <a
                    href={manual.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="uuc-manual__btn"
                  >
                    <FileText size={16} />
                    {manual?.buttonText || "View PDF"}
                    <ArrowRight />
                  </a>
                </div>
                <div className="uuc-manual__media">
                  {manual?.image ? (
                    <img src={manual.image} alt="Student Manual" />
                  ) : (
                    <img src="/images/manual_image_73bc4d52fc.png" alt="Student Manual" />
                  )}
                </div>
              </div>
            </div>
          </Rise>
        </section>
      )}

      {/* ---- Login portals ---- */}
      {loginCards.length > 0 && (
        <section className="uuc-portals">
          <div className="container">
            <Rise className="uuc-portals__head">
              <span className="uuc-intro__eyebrow">
                <i /> {headerPortal?.title || "Login Portals"}
              </span>
              <h2 className="uuc-intro__title">Login Portals</h2>
              <p className="uuc-portals__desc">
                Choose the portal that matches your role and get started in a few clicks.
              </p>
            </Rise>

            <div className="uuc-portals__grid">
              {loginCards.map((p: any, i: number) => {
                const meta = CARD_META[i % CARD_META.length];
                const Icon = meta.icon;
                const isLink = !!p?.link;
                const CardWrap = isLink ? "a" : "div";
                return (
                  <Rise key={p?.id || i} delay={(i % 3) * 0.06}>
                    <CardWrap
                      href={isLink ? p.link : undefined}
                      target={isLink ? "_blank" : undefined}
                      rel={isLink ? "noopener noreferrer" : undefined}
                      className="uuc-portal"
                    >
                      <div className="uuc-portal__media">
                        <span className="uuc-portal__icon-big">
                          <Icon />
                        </span>
                        {isLink && (
                          <span className="uuc-portal__arrow">
                            <ExternalLink />
                          </span>
                        )}
                      </div>
                      <div className="uuc-portal__body">
                        <h3 className="uuc-portal__title">{p?.title}</h3>
                        {p?.description && <p className="uuc-portal__desc">{p.description}</p>}
                        {isLink && (
                          <span className="uuc-portal__btn">
                            Login Here <ExternalLink />
                          </span>
                        )}
                      </div>
                    </CardWrap>
                  </Rise>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---- CTA ---- */}
      <section className="container" style={{ paddingBottom: 96 }}>
        <Rise>
          <div className="uuc-cta">
            <div>
              <h3 className="uuc-cta__title">Ready to get started?</h3>
              <p className="uuc-cta__desc">
                Head to the UUCMS login portals to submit your application, register as a
                candidate, or sign in as a student.
              </p>
            </div>
            <Link href="/uucms/login-portals" className="uuc-cta__btn">
              <LogIn size={16} /> Open Login Portals <ArrowRight />
            </Link>
          </div>
        </Rise>
      </section>
    </main>
  );
};

export default UUCMS;
