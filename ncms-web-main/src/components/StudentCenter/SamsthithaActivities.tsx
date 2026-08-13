"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const SamsthithaActivities = ({ data }: any) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Gentle auto-scroll that pauses while the user is interacting.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || isUserScrolling) return;

    const autoScroll = () => {
      if (!track) return;
      const card = track.querySelector<HTMLElement>(".sc-gallery__card");
      const step = card ? card.offsetWidth + 18 : 320;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 8) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: step, behavior: "smooth" });
      }
    };

    const interval = setInterval(autoScroll, 3200);
    return () => clearInterval(interval);
  }, [isUserScrolling]);

  const handleScroll = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    setIsUserScrolling(true);
    const card = track.querySelector<HTMLElement>(".sc-gallery__card");
    const step = card ? card.offsetWidth + 18 : 320;
    track.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
    setTimeout(() => setIsUserScrolling(false), 2600);
  };

  return (
    <div className="sc-gallery">
      <div className="sc-hub__head" style={{ marginBottom: "22px" }}>
        <div>
          <span className="sc-eyebrow">Memories</span>
          <h2 className="sc-title">{data?.title || "Samsthitha Activities"}</h2>
          <p className="sc-lead" style={{ margin: "10px 0 0", maxWidth: "none", textAlign: "left" }}>
            Moments from alumni meets, sports events and guest interactions.
          </p>
        </div>
      </div>

      <motion.div
        className="sc-gallery__viewport"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          ref={trackRef}
          className="sc-gallery__track"
          onMouseEnter={() => setIsUserScrolling(true)}
          onMouseLeave={() => setIsUserScrolling(false)}
        >
          {(data?.activities || []).map((activity: { image: string; title: string }, index: number) => (
            <div key={index} className="sc-gallery__card">
              <div className="sc-gallery__frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activity.image} alt={activity.title} loading="lazy" />
                <span className="sc-gallery__index">{String(index + 1).padStart(2, "0")}</span>
                <p className="sc-gallery__cap">{activity.title}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="sc-gallery__arrows">
        <button type="button" className="sc-gallery__arrow" onClick={() => handleScroll("left")} aria-label="Scroll left">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <button type="button" className="sc-gallery__arrow" onClick={() => handleScroll("right")} aria-label="Scroll right">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SamsthithaActivities;
