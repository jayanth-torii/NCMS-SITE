"use client";

import React from "react";
import CtaLink from "./CtaLink";
import highlight from "./highlight";
import Reveal from "./Reveal";

const sp: React.SVGProps<SVGSVGElement> = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };
const FACT_ICONS: Record<string, React.ReactNode> = {
  calendar: (
    <svg {...sp}>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </svg>
  ),
  cap: (
    <svg {...sp}>
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1 2.7 2 6 2s6-1 6-2v-5" />
    </svg>
  ),
  pin: (
    <svg {...sp}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
};
const ArrowIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const AboutNcet = ({ data }: { data?: any }) => {
  const { title, description = [], buttonText, link, image } = data || {};

  return (
    <section className="aboutx" aria-labelledby="aboutx-title">
      {/* background decorations */}
      <span className="aboutx__bg aboutx__bg--dots-tl" aria-hidden="true" />
      <span className="aboutx__bg aboutx__bg--circle" aria-hidden="true" />
      <span className="aboutx__bg aboutx__bg--radar" aria-hidden="true" />
      <span className="aboutx__bg aboutx__bg--dots-br" aria-hidden="true" />
      <span className="aboutx__bg aboutx__bg--blob" aria-hidden="true" />

      <div className="container">
        <div className="aboutx__grid">
          {/* LEFT — layered visual */}
          <Reveal className="aboutx__visual">
            <span className="aboutx__shape aboutx__shape--navy-l" aria-hidden="true" />
            <span className="aboutx__shape aboutx__shape--navy-r" aria-hidden="true" />
            <span className="aboutx__shape aboutx__shape--dome" aria-hidden="true" />
            <span className="aboutx__rings" aria-hidden="true" />

            <div className="aboutx__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={title} loading="lazy" />
            </div>

            <div className="aboutx__logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/NGI_Logo_d53c56dedc_11eae0a723.png" alt="Nagarjuna Group of Institutions" />
            </div>

            <div className="aboutx__facts">
              <div className="aboutx__fact">
                <span className="aboutx__fact-ic">{FACT_ICONS.calendar}</span>
                <span className="aboutx__fact-txt">
                  <small>Established</small>
                  <strong>2015</strong>
                </span>
              </div>
              <div className="aboutx__fact">
                <span className="aboutx__fact-ic">{FACT_ICONS.cap}</span>
                <span className="aboutx__fact-txt">
                  <strong>Affiliated to BNU</strong>
                </span>
              </div>
              <div className="aboutx__fact">
                <span className="aboutx__fact-ic">{FACT_ICONS.pin}</span>
                <span className="aboutx__fact-txt">
                  <strong>Chikkaballapur</strong>
                </span>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — content */}
          <Reveal className="aboutx__content">
            <span className="aboutx__eyebrow">Welcome to NCMS</span>
            <h2 id="aboutx-title" className="aboutx__title">
              {highlight(title, "NCMS")}
            </h2>
            <span className="aboutx__title-bar" aria-hidden="true" />
            {description.map((para: string, i: number) => (
              <p className="aboutx__text" key={i}>
                {para}
              </p>
            ))}
            <CtaLink to={link || "/about-ncms"} className="aboutx__cta">
              <span>{buttonText || "Know More"}</span>
              <span className="aboutx__cta-ic">{ArrowIcon}</span>
            </CtaLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default AboutNcet;
