"use client";

import { useEffect, useState } from "react";

const ScrollToTop = ({ scrollClassName }: { scrollClassName?: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Button is displayed after scrolling for 200 pixels
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 200);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div id="backscrollUp" className={scrollClassName || "react__up___scroll"}>
      {isVisible && <span className="arrow_carrot-up" onClick={scrollToTop}></span>}
    </div>
  );
};

export default ScrollToTop;
