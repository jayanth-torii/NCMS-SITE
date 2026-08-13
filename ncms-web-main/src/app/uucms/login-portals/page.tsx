"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ExternalLink, Lock, CheckCircle2, ShieldCheck,
  ClipboardList, UserCheck, BadgeCheck,
} from "lucide-react";

import PageBanner from "@/components/PageBanner/PageBanner";
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

const CARD_META: { icon: React.ComponentType<any>; label: string }[] = [
  { icon: ClipboardList, label: "Registration" },
  { icon: UserCheck, label: "Student Access" },
  { icon: BadgeCheck, label: "Candidate" },
];

const LoginPortals = () => {
  const { data: liveData } = useLiveData(getUucms, UUCMSData as any);
  const d: any = liveData || (UUCMSData as any).data || UUCMSData;

  const portals: any[] = d?.loginPortals || [];
  const headerPortal = portals[0] || {};
  const loginCards = portals.slice(1);

  return (
    <main className="uuc-page">
      <PageBanner
        title="Login Portals"
        eyebrow="UUCMS Access"
        subtitle={
          headerPortal?.description ||
          "Login as a student or candidate to stay connected and informed!"
        }
        image="/images/uucms_banner_1_61538c9f81.png"
      />

      <section className="uuc-portals" style={{ paddingTop: 64 }}>
        <div className="container">
          <Rise className="uuc-portals__head">
            <span className="uuc-intro__eyebrow">
              <i /> {headerPortal?.title || "Login Portals"}
            </span>
            <h1 className="uuc-intro__title">
              {highlight("Login Portals", "Portals")}
            </h1>
            <p className="uuc-portals__desc">
              {headerPortal?.description ||
                "Select the portal that matches your role to continue."}
            </p>
            <div className="uuc-chips" style={{ justifyContent: "center" }}>
              <span className="uuc-chip">
                <Lock /> Secure
              </span>
              <span className="uuc-chip">
                <CheckCircle2 /> Official UUCMS
              </span>
              <span className="uuc-chip">
                <ShieldCheck /> Govt. of Karnataka
              </span>
            </div>
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

          <Rise delay={0.1} className="text-center mt-12">
            <Link
              href="/uucms"
              className="inline-flex items-center gap-2 text-[#0e2455] font-bold text-sm hover:text-[#f6872a] transition-colors"
            >
              <ArrowLeft size={16} /> Back to UUCMS
            </Link>
          </Rise>
        </div>
      </section>
    </main>
  );
};

export default LoginPortals;
