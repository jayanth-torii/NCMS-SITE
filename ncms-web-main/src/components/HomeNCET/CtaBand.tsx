"use client";

import React from "react";
import CtaLink from "./CtaLink";

const sp: React.SVGProps<SVGSVGElement> = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };
const ICONS: Record<string, React.ReactNode> = {
  cap: (
    <svg {...sp}>
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1 2.7 2 6 2s6-1 6-2v-5" />
    </svg>
  ),
  calendar: (
    <svg {...sp}>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </svg>
  ),
  shield: (
    <svg {...sp}>
      <path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  users: (
    <svg {...sp}>
      <circle cx="9" cy="8" r="3.1" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 6.2a3 3 0 0 1 0 5.6" />
      <path d="M17 14.4A5.5 5.5 0 0 1 20.5 19" />
    </svg>
  ),
  rocket: (
    <svg {...sp}>
      <path d="M5 15c-1.5 1-2 5-2 5s4-.5 5-2a2.1 2.1 0 0 0-3-3Z" />
      <path d="M9 14c5-2 9-7 9-11 0 0-6 0-11 5-2 2-2 4-2 4l4 4s2 0 4-2Z" />
      <circle cx="14.5" cy="8.5" r="1.4" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  chat: (
    <svg {...sp}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z" />
      <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
    </svg>
  ),
};

const CHIPS = [
  { id: "open", icon: "cap", title: "Admissions Open", text: "Your future starts here." },
  { id: "intake", icon: "calendar", title: "2025-26 Intake", text: "Build. Learn. Lead." },
];

const FEATURES = [
  { icon: "shield", title: "Trusted Legacy", text: "Quality education that empowers" },
  { icon: "users", title: "Vibrant Community", text: "Collaborate. Connect. Grow together." },
  { icon: "rocket", title: "Limitless Opportunities", text: "Explore paths. Expand possibilities." },
];

const CtaBand = ({ data }: { data?: any }) => {
  const img = data?.image || "/images/apply_now_banner_ba177d3cc6.png";
  return (
    <section className="adb" aria-labelledby="adb-title">
      <div className="container">
        <div className="adb__panel">
          {/* decorative geometric layer */}
          <div className="adb__decor" aria-hidden="true">
            <span className="adb__dot-grid" />
            <span className="adb__glow adb__glow--orange" />
            <span className="adb__glow adb__glow--blue" />
            <span className="adb__shape adb__shape--ring" />
            <span className="adb__shape adb__shape--diamond" />
            <span className="adb__shape adb__shape--diamond-sm" />
            <span className="adb__shape adb__shape--plus" />
            <span className="adb__shape adb__shape--triangle" />
          </div>

          <div className="adb__grid">
            {/* left copy */}
            <div className="adb__copy">
              <span className="adb__eyebrow">
                <i aria-hidden="true" />
                Admissions 2025-26
              </span>
              <h2 id="adb-title" className="adb__title">
                Begin your journey <span className="hl-ed">@ NCMS</span>
              </h2>
              <p className="adb__sub">
                Join a community where ambition meets opportunity. Talk to our admissions team and take the first step toward a future-ready career.
              </p>
              <div className="adb__actions">
                <CtaLink to="/apply-now" className="adb__btn adb__btn--primary">
                  <span>Apply Now</span>
                  <span className="adb__btn-ic">{ICONS.arrow}</span>
                </CtaLink>
                <CtaLink to="/contact-us" className="adb__btn adb__btn--ghost">
                  <span className="adb__btn-chat">{ICONS.chat}</span>
                  <span>Talk to us</span>
                </CtaLink>
              </div>

              {/* inline info chips (no floating overlap) */}
              <div className="adb__chips">
                {CHIPS.map((c) => (
                  <div className="adb__chip" key={c.id}>
                    <span className="adb__chip-ic">{ICONS[c.icon]}</span>
                    <span className="adb__chip-txt">
                      <strong>{c.title}</strong>
                      <small>{c.text}</small>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* right visual — image anchored right, like the global banner */}
            <div className="adb__visual">
              <div className="adb__frame">
                <img src={img} alt="NCMS campus" loading="lazy" />
                <span className="adb__frame-shine" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* bottom feature cards */}
          <div className="adb__features">
            {FEATURES.map((f, i) => (
              <div className="adb__feat" key={i}>
                <span className="adb__feat-ic">{ICONS[f.icon]}</span>
                <span className="adb__feat-txt">
                  <strong>{f.title}</strong>
                  <small>{f.text}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBand;
