"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";

// "Life at NCMS" — image cards from the gallery. Desktop shows all; mobile
// clamps to 4 and reveals the rest via "Load All".
const INITIAL = 4;

const useIsMobile = (query = "(max-width: 991px)") => {
  const [match, setMatch] = React.useState(
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
};

const CampusLife = ({ data, social }: { data?: any; social?: any }) => {
  const gallery: Record<string, string[]> = data || {};
  const clubs = Object.entries(gallery)
    .map(([name, imgs]) => ({ name, image: imgs[0], link: "/gallery" }))
    // Cap at 8 for design parity with NCET's Campus Life grid.
    .slice(0, 8);
  const [showAll, setShowAll] = useState(false);
  const clampScreen = useIsMobile("(max-width: 991px)"); // true on tablet/phone

  const cardInner = (club: { name: string; image: string; link: string }) => (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="campus-ed__img" src={club.image} alt={club.name} loading="lazy" />
      <span className="campus-ed__overlay" aria-hidden="true" />
      <div className="campus-ed__social">
        <a href={social?.facebook || "https://www.facebook.com/ncmschickballapur/"} target="_blank" rel="noreferrer" aria-label="Facebook">
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a href={social?.instagram || "https://www.instagram.com/ncmschickaballapur/"} target="_blank" rel="noreferrer" aria-label="Instagram">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      </div>
      <h3 className="campus-ed__name">
        <span>{club.name}</span>
      </h3>
    </>
  );

  const base = clubs.slice(0, INITIAL);
  const extra = clubs.slice(INITIAL);

  return (
    <section className="campus-ed" aria-labelledby="campus-ed-title">
      <div className="container">
        <div className="section-head-ed">
          <span className="eyebrow-ed">Life at NCMS</span>
          <h2 id="campus-ed-title" className="heading-ed">
            Campus Life
          </h2>
          <p className="section-sub-ed">Culture, creativity, discipline and community — where students grow beyond the classroom.</p>
        </div>

        <div className="campus-ed__grid">
          {base.map((club, i) => (
            <article className="campus-ed__card" key={i}>
              {cardInner(club)}
            </article>
          ))}

          {!clampScreen ? (
            // desktop: all extra cards always visible
            extra.map((club, i) => (
              <article className="campus-ed__card" key={`e-${i}`}>
                {cardInner(club)}
              </article>
            ))
          ) : (
            // tablet/phone: reveal extras via "Load All"
            <AnimatePresence>
              {showAll &&
                extra.map((club, i) => (
                  <motion.article
                    className="campus-ed__card"
                    key={`x-${i}`}
                    initial={{ opacity: 0, y: 26, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 18, scale: 0.97 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
                  >
                    {cardInner(club)}
                  </motion.article>
                ))}
            </AnimatePresence>
          )}
        </div>

        {clampScreen && extra.length > 0 && (
          <div className="more-toggle-wrap">
            <button
              type="button"
              className="more-toggle"
              onClick={() => setShowAll((o) => !o)}
              aria-expanded={showAll}
            >
              {showAll ? "Show Less" : `Load All (${extra.length} more)`}
              <svg className={showAll ? "is-open" : ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CampusLife;
