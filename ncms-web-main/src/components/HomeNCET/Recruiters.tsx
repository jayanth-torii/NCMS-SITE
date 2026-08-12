"use client";

import React from "react";

const Recruiters = ({ data }: { data?: any }) => {
  const partners: { name: string; logo: string }[] = data || [];
  const logos = partners.map((p) => p.logo).filter(Boolean);
  const loop = [...logos, ...logos];

  return (
    <section className="recruiters-ed" aria-label="Our recruiters">
      <div className="container">
        <div className="section-head-ed section-head-ed--center">
          <span className="eyebrow-ed">Our Recruiting Partners</span>
          <h2 className="heading-ed">
            Trusted by leading <span className="hl-ed">companies</span>
          </h2>
        </div>
      </div>

      <div className="recruiters-ed__marquee">
        <div className="recruiters-ed__track">
          {loop.map((src: string, i: number) => (
            <div className="recruiters-ed__logo" key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Recruiter logo" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recruiters;
