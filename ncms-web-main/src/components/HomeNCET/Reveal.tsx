"use client";

import React, { useEffect, useRef, useState } from "react";

// Lightweight, dependency-free scroll reveal. Wraps a section and fades/slides
// it in once it enters the viewport. Falls back to visible if Intersection
// Observer is unavailable.
const Reveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal-ed ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
};

export default Reveal;
