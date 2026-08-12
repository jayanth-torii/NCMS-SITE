"use client";

import React from "react";
import highlight from "./highlight";
import Reveal from "./Reveal";

// "Celebrating 25 Years of Academic Excellence" — content from NCMS yrs25Section.
const Anniversary = ({ data }: { data?: any }) => {
  const { heading, description, image } = data || {};

  return (
    <section className="anniversary-section" aria-labelledby="anniversary-title">
      {/* decorations */}
      <span className="anni__dots anni__dots--tl" aria-hidden="true" />
      <span className="anni__dots anni__dots--br" aria-hidden="true" />
      <span className="anni__radar anni__radar--l" aria-hidden="true" />
      <span className="anni__radar anni__radar--r" aria-hidden="true" />
      <span className="anni__plus anni__plus--1" aria-hidden="true" />
      <span className="anni__plus anni__plus--2" aria-hidden="true" />
      <span className="anni__plus anni__plus--3" aria-hidden="true" />

      <div className="container">
        <div className="anniversary-grid">
          <Reveal className="anniversary-media">
            <span className="anni__dots anni__dots--bl" aria-hidden="true" />
            <div className="anni__frame">
              <span className="anni__plate" aria-hidden="true" />
              <span className="anni__ring" aria-hidden="true" />
              <div className="anni__badge">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={heading} loading="lazy" />
                <span className="anni__shine" aria-hidden="true" />
              </div>
            </div>
          </Reveal>

          <Reveal className="anniversary-content">
            <span className="anniversary-badge">Our Milestone</span>
            <h2 id="anniversary-title" className="anniversary-title">
              {highlight(heading, "Excellence")}
            </h2>
            {description
              ? String(description)
                  .split("\n\n")
                  .map((para: string, i: number) => (
                    <p className="anniversary-desc" key={i}>
                      {para}
                    </p>
                  ))
              : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Anniversary;
