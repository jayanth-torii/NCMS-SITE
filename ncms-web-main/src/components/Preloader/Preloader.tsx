"use client";

import { useEffect, useState } from "react";

const Preloader = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hide = () => setHidden(true);
    // Hide once the window has fully loaded; fall back to a safety timeout so
    // the fixed overlay never blocks the page even if `load` never fires.
    if (document.readyState === "complete") {
      hide();
      return undefined;
    }
    window.addEventListener("load", hide);
    const safety = window.setTimeout(hide, 2500);
    return () => {
      window.removeEventListener("load", hide);
      window.clearTimeout(safety);
    };
  }, []);

  if (hidden) return null;

  return (
    <div id="react__preloader">
      <div id="react__circle_loader"></div>
      <div className="react__loader_logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/ngi_logo.png" alt="Preload" />
      </div>
    </div>
  );
};

export default Preloader;
