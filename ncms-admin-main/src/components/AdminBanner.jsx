import React, { useLayoutEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import "./adminBanner.scss";

/* ================================================================== *
 * AdminBanner — the single shared page banner used by every admin
 * content page (About NCMS, Mandatory Disclosure, Home Page, ...).
 * Navy gradient + orange tag + status pills. Animejs entrance with
 * reduced-motion fallback. Content and styling are identical across
 * all pages so the admin feels like one product.
 * ================================================================== */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const AdminBanner = ({ title, tag, subtitle, pills = [], actions }) => {
  const ref = useRef(null);

  // Entrance choreography: banner slides/fades in, pills stagger.
  // useLayoutEffect so the hide happens before the browser paints.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";

    const pillEls = el.querySelectorAll(".admin-banner__pill");
    pillEls.forEach((p) => {
      p.style.opacity = "0";
      p.style.transform = "translateY(8px)";
    });

    animate(el, {
      translateY: [16, 0],
      opacity: [0, 1],
      easing: "easeOutCubic",
      duration: 620,
      onComplete: () => {
        el.style.transform = "";
      },
    });

    animate(pillEls, {
      translateY: [8, 0],
      opacity: [0, 1],
      delay: stagger(90, { start: 240 }),
      easing: "easeOutQuad",
      duration: 440,
      onComplete: () => {
        pillEls.forEach((p) => {
          p.style.transform = "";
        });
      },
    });
  }, []);

  return (
    <div className="admin-banner" ref={ref}>
      <div className="admin-banner__text">
        <h2 className="admin-banner__title">
          {title}
          {tag && <span className="admin-banner__tag">{tag}</span>}
        </h2>
        {subtitle && <p className="admin-banner__subtitle">{subtitle}</p>}
      </div>
      <div className="admin-banner__right">
        {actions && <div className="admin-banner__actions">{actions}</div>}
        {pills.length > 0 && (
          <div className="admin-banner__pills">
            {pills.map((p, i) => (
              <span key={i} className="admin-banner__pill">
                {p}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBanner;
