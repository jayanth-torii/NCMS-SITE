"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Eye, Target, Newspaper, ArrowRight, Mail, Sparkles } from "lucide-react";

import PageBanner from "@/components/PageBanner/PageBanner";
import PageDecor from "@/components/ui/PageDecor";
import highlight from "@/components/HomeNCET/highlight";

import newsLetterData from "@/data-export/news-letter/data.json";
import { getNewsLetter } from "@/services/data.service";
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

const SectionHead = ({
  eyebrow,
  heading,
  hl,
  onDark = false,
  center = true,
}: {
  eyebrow: string;
  heading: string;
  hl?: string;
  onDark?: boolean;
  center?: boolean;
}) => (
  <div className={`${center ? "text-center" : ""} mb-4`}>
    <span className={`eyebrow-ed${onDark ? " eyebrow-ed--on-dark" : ""}`}>{eyebrow}</span>
    <h2 className={`heading-ed${onDark ? " heading-ed--on-dark" : ""}`}>
      {hl ? highlight(heading, hl) : heading}
    </h2>
  </div>
);

const NewsLetter = () => {
  const { data: liveData } = useLiveData(getNewsLetter, newsLetterData as any);
  const d: any = liveData || (newsLetterData as any).data || newsLetterData;

  const banner = d?.banner || {};
  const aboutVm = d?.AboutVisionMission || {};
  const about = aboutVm?.AboutSection || {};
  const visionMission = aboutVm?.VisionMission || {};
  const accordions = aboutVm?.AccordionSections || [];
  const volumes = d?.View_Volumes || {};
  const volumeList = volumes?.Volumes || [];

  const vision =
    (visionMission?.sections || []).find((s: any) => /vision/i.test(s?.title || "")) || {};
  const mission =
    (visionMission?.sections || []).find((s: any) => /mission/i.test(s?.title || "")) || {};

  const aboutTexts = about?.descriptions || [];
  const firstPara = aboutTexts[0] || "";
  const restParas = aboutTexts.slice(1);

  return (
    <main className="nwl-page">
      <PageDecor />

      <PageBanner
        eyebrow="Nudi Chaitanya"
        title={banner?.title || "Newsletter"}
        subtitle={
          volumes?.description ||
          "Stay updated with the latest developments, research, and events at Nagarjuna College of Management Studies."
        }
        image={banner?.image || "/images/news_letter_banner_7fd0aeeee4.png"}
      />

      {/* ---- About (Nudi Chaitanya) ---- */}
      <section className="nwl-about">
        <div className="container">
          <div className="nwl-about__grid">
            <Rise>
              <span className="nwl-about__eyebrow">
                <i /> The College Newsletter
              </span>
              <h1 className="nwl-about__title">
                {about?.title ? highlight(about.title, "Chaitanya") : "Nudi Chaitanya"}
              </h1>
              {firstPara && <p className="nwl-about__text">{firstPara}</p>}
              {restParas.map((p: string, i: number) => (
                <p className="nwl-about__text" key={i}>
                  {p}
                </p>
              ))}
              <div className="nwl-about__badges">
                <span className="nwl-about__badge">
                  <Mail size={15} /> Editorial Board
                </span>
                <span className="nwl-about__badge">
                  <Sparkles size={15} /> Campus Stories
                </span>
                <span className="nwl-about__badge">
                  <Newspaper size={15} /> Quarterly Editions
                </span>
              </div>
            </Rise>

            <Rise delay={0.12} className="nwl-about__media">
              {volumeList[0]?.image ? (
                <img src={volumeList[0].image} alt="Nudi Chaitanya Newsletter" />
              ) : (
                <img src="/images/volume1_8c850da3a4.png" alt="Nudi Chaitanya Newsletter" />
              )}
              <span className="nwl-about__media__tag">
                <BookOpen size={14} /> {visionMission?.title || "Newsletter"}
              </span>
              <span className="nwl-about__media__cap">
                {volumeList[0]?.title} — {volumeList[0]?.volume || "Latest Edition"}
              </span>
            </Rise>
          </div>
        </div>
      </section>

      {/* ---- Vision & Mission (NDC navy pattern) ---- */}
      {(vision?.description || vision?.points?.length || mission?.description || mission?.points?.length) && (
        <section className="nwl-vm">
          <div className="container">
            <Rise className="nwl-vm__shell">
              <div className="nwl-vm__head">
                <span className="nwl-vm__eyebrow">{visionMission?.title || "Our Vision & Mission"}</span>
                <h2 className="nwl-vm__title">
                  {highlight("Vision & Mission", ["Vision", "Mission"])}
                </h2>
              </div>
              <div className="nwl-vm__grid">
                {(vision?.description || vision?.points?.length > 0) && (
                  <div className="nwl-vm__card">
                    <span className="nwl-vm__icon nwl-vm__icon--blue">
                      <Eye />
                    </span>
                    <h3 className="nwl-vm__card-title">{vision?.title || "Our Vision"}</h3>
                    {vision?.description && <p className="nwl-vm__desc">{vision.description}</p>}
                    {vision?.points?.length > 0 && (
                      <ul className="nwl-vm__list">
                        {vision.points.map((p: string, i: number) => (
                          <li className="nwl-vm__point" key={i}>
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {(mission?.description || mission?.points?.length > 0) && (
                  <div className="nwl-vm__card">
                    <span className="nwl-vm__icon nwl-vm__icon--orange">
                      <Target />
                    </span>
                    <h3 className="nwl-vm__card-title">{mission?.title || "Our Mission"}</h3>
                    {mission?.description && <p className="nwl-vm__desc">{mission.description}</p>}
                    {mission?.points?.length > 0 && (
                      <ul className="nwl-vm__list">
                        {mission.points.map((p: string, i: number) => (
                          <li className="nwl-vm__point" key={i}>
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </Rise>
          </div>
        </section>
      )}

      {/* ---- Accordions (if any) ---- */}
      {accordions?.length > 0 && (
        <section className="nwl-volumes">
          <div className="container">
            <div className="nwl-volumes__head">
              <SectionHead eyebrow="Highlights" heading="More from the Newsletter" />
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
              {accordions.map((acc: any, i: number) => (
                <Rise key={i} delay={i * 0.05}>
                  <div
                    className="rounded-2xl border border-[#eef1f6] bg-white p-6 shadow-[0_12px_28px_rgba(14,36,85,0.05)]"
                  >
                    <h3 className="text-[#0e2455] text-lg font-extrabold mb-3">{acc?.title}</h3>
                    <ul className="grid gap-2">
                      {(acc?.points || []).map((pt: string, j: number) => (
                        <li key={j} className="flex gap-2.5 text-[#53545b] text-sm leading-relaxed">
                          <span className="mt-[7px] w-2 h-2 shrink-0 rounded-full bg-[#f6872a]" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Rise>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Volumes ---- */}
      {volumeList.length > 0 && (
        <section className="nwl-volumes">
          <div className="container">
            <Rise className="nwl-volumes__head">
              <SectionHead
                eyebrow={volumes?.title || "Archives"}
                heading="View Volumes"
                hl="Volumes"
              />
              {volumes?.description && <p className="nwl-volumes__desc">{volumes.description}</p>}
            </Rise>

            <div className="nwl-volumes__grid">
              {volumeList.map((v: any, i: number) => (
                <Rise key={v?.id || i} delay={(i % 3) * 0.06}>
                  <a
                    href={v?.pdf || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nwl-volume"
                  >
                    <div className="nwl-volume__cover">
                      <img src={v?.image || "/images/volume1_8c850da3a4.png"} alt={v?.title || "Newsletter volume"} />
                      <span className="nwl-volume__badge">
                        <FileText size={11} style={{ display: "inline", marginRight: 5 }} />
                        {v?.volume || `Volume ${i + 1}`}
                      </span>
                    </div>
                    <div className="nwl-volume__body">
                      <h3 className="nwl-volume__title">{v?.title || "Nudi Chaitanya"}</h3>
                      <span className="nwl-volume__volume">{v?.volume || ""}</span>
                      <span className="nwl-volume__view">
                        View Volume <ArrowRight />
                      </span>
                    </div>
                  </a>
                </Rise>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default NewsLetter;
