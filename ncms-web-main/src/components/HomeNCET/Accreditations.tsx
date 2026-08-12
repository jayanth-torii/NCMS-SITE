"use client";

import React from "react";

// "Accreditations and Affiliations" — content from NCMS home accordination.
const Accreditations = ({ data }: { data?: any }) => {
  const { mainHead, title1, title2, images = [] } = data || {};
  const heading = mainHead || "Accreditations and Affiliations";
  const badges = [title1, title2].filter(Boolean);
  const logos = images || [];
  // Repeat the (small) logo set so the marquee fills the row, then duplicate
  // the whole sequence so the -50% scroll loops seamlessly.
  const base = logos.length < 9 ? [...logos, ...logos, ...logos] : logos;
  const loop = [...base, ...base];

  return (
    <section className="accreditations-section" aria-labelledby="accreditations-title">
      <div className="container">
        <div className="accreditations-card">
          <div className="accreditations-badges">
            {badges.map((text: string, i: number) => (
              <span
                key={i}
                className={`accreditation-badge${i === badges.length - 1 ? " accreditation-badge--accent" : ""}`}
              >
                {text}
              </span>
            ))}
          </div>

          <h2 id="accreditations-title" className="accreditations-title">
            {heading}
          </h2>

          <div className="accreditations-marquee">
            <div className="accreditations-track">
              {loop.map((src: string, i: number) => (
                <div className="accreditation-logo" key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Accreditation logo" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accreditations;
