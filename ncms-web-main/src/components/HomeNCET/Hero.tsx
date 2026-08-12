"use client";

import React, { useEffect, useState } from "react";
import CtaLink from "./CtaLink";

type Slide = { id: number; heading: string; description: string; bgImage: string };

const Hero = ({ data }: { data?: any }) => {
  const banner = data || {};
  const slides: Slide[] = banner.slides || [];
  const [idx, setIdx] = useState(0);

  // Rotate the overlaid headline/description every 5.5s (exact NCET timing).
  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const active = slides[idx] || { heading: "", description: "" };

  return (
    <section className="hero-ed" aria-label="NCMS highlights">
      <div className="hero-ed__slide">
        {active.bgImage && (
          <div className="hero-ed__bg" style={{ backgroundImage: `url(${active.bgImage})` }} role="img" aria-label={active.heading} />
        )}

        <div className="hero-ed__scrim" />

        <div className="container hero-ed__inner">
          <div className="hero-ed__content">
            <span className="hero-ed__eyebrow">Nagarjuna College of Management Studies</span>
            <div className="hero-ed__rotator" key={idx}>
              <h1 className="hero-ed__title">{active.heading}</h1>
              <p className="hero-ed__desc">{active.description}</p>
            </div>
            <div className="hero-ed__cta">
              <CtaLink to="/apply-now" className="btn-ed btn-ed--primary">
                Apply Now
              </CtaLink>
              <CtaLink to="/contact-us" className="btn-ed btn-ed--ghost btn-ed--ghost-light">
                Have a query?
              </CtaLink>
            </div>

            {slides.length > 1 && (
              <div className="hero-ed__dotsrow" role="tablist" aria-label="Highlights">
                {slides.map((slide, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={slide.heading}
                    aria-selected={i === idx}
                    className={`hero-ed__dot${i === idx ? " is-active" : ""}`}
                    onClick={() => setIdx(i)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
