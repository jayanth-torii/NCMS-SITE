"use client";

import React from "react";

const Recruiters = ({ data, records }: { data?: any; records?: any[] }) => {
  const partners: { name: string; logo: string }[] = data || [];
  const logos = partners.map((p) => p.logo).filter(Boolean);

  // Real CMS-driven trust metrics (from the home-page Records strip) —
  // never invented numbers.
  const findRecord = (title: string) =>
    (records || []).find((r: any) =>
      String(r?.title || "")
        .toLowerCase()
        .includes(title.toLowerCase())
    );
  const placements = findRecord("Placement");
  const alumni = findRecord("Alumni");
  const metrics = [
    {
      value: placements?.count || "1000+",
      label: placements?.title || "Placements",
    },
    {
      value: `${partners.length}+`,
      label: "Recruiting Partners",
    },
    {
      value: alumni?.count || "1500+",
      label: alumni?.title || "Happy Alumni",
    },
  ];

  // One full set per row, two rows side by side, translateX(-100%) = seamless loop.
  const row = (key: string) => (
    <div className="recruiters-ed__row" key={key} aria-hidden={key === "dup"}>
      {logos.map((src: string, i: number) => (
        <div
          className="recruiters-ed__tile"
          key={`${key}-${i}`}
          title={partners[i % partners.length]?.name || "Recruiter"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Recruiter logo" loading="lazy" />
        </div>
      ))}
    </div>
  );

  return (
    <section className="recruiters-ed" aria-label="Our recruiters">
      <div className="recruiters-ed__dots" aria-hidden="true" />
      <div className="recruiters-ed__watermark" aria-hidden="true">
        PLACEMENTS
      </div>

      <div className="container recruiters-ed__inner">
        <div className="recruiters-ed__head">
          <span className="recruiters-ed__eyebrow">Our Recruiting Partners</span>
          <h2 className="recruiters-ed__title">
            Trusted by leading <span>companies</span>
          </h2>
        </div>

        <div className="recruiters-ed__card">
          <div className="recruiters-ed__marquee">
            {row("main")}
            {row("dup")}
          </div>

          <div className="recruiters-ed__metrics">
            {metrics.map((m, i) => (
              <div className="recruiters-ed__metric" key={i}>
                <p className="recruiters-ed__value">{m.value}</p>
                <p className="recruiters-ed__label">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recruiters;
