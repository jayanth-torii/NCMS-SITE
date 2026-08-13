"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Per-page hero banner images (navy-left → photo-right so the title/eyebrow/
// subtitle sit legibly over the navy zone). Keyed by route; subpages inherit
// via prefix match. Pages not listed fall back to the navy gradient in PageBanner.css.
const HERO_IMAGES: Record<string, string> = {
  "/about-ncms": "/images/contact_us_bannerr_512b0da77d.png",
  "/blog": "/images/blogs_banner_a494e12d91.png",
  "/contact-us": "/images/contact_us_bannerr_512b0da77d.png",
  "/gallery": "/images/banner_image_a0e6403994.png",
  "/placements": "/images/placement_banner_a29508cee4.png",
  "/placement": "/images/placement_banner_a29508cee4.png",
  "/samashti": "/images/samashti_banner_eef451d415.png",
  "/student-center": "/images/StudentCenter/banner.png",
  "/iic": "/images/iic_banner_34403e17dd.png",
  "/iqac": "/images/iqac_banner_f547b8b5c9.png",
  "/news-clippings": "/images/news_clippings_banner_91a5271416.png",
  "/news-letter": "/images/news_letter_banner_7fd0aeeee4.png",
  "/uucms": "/images/uucms_banner_1_61538c9f81.png",
  "/mandatory-disclosure": "/images/mandatory_disclosure_banner_f845d5671c.png",
  "/audit-reports": "/images/audit_reports_banner_ebc0b60d1c.png",
  "/anti-ragging": "/images/anti_ragging_banner_fcf75f2a08.png",
  "/events": "/images/events_banner_687e52de91.png",
  "/apply-now": "/images/apply_now_banner_ba177d3cc6.png",
};

// Match a pathname against route keys: exact match first, then the longest
// registered prefix (so subpages/detail routes inherit their section).
const matchKey = (pathname: string, keys: string[]) => {
  if (keys.includes(pathname)) return pathname;
  return (
    keys
      .filter((k) => pathname === k || pathname.startsWith(k + "/"))
      .sort((a, b) => b.length - a.length)[0] || null
  );
};

const PageBanner = ({
  title,
  eyebrow,
  facts = [],
  breadcrumbs = [],
  subtitle,
  image,
  className = "",
  style = {},
  children,
}: {
  title?: string;
  eyebrow?: string;
  facts?: string[];
  breadcrumbs?: { label: string; path?: string }[];
  subtitle?: string;
  image?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) => {
  const titleParts = title ? title.trim().split(" ") : [];
  const titleLast = titleParts.pop();
  const pathname = usePathname();

  const matchedKey = matchKey(pathname, Object.keys(HERO_IMAGES));
  const heroImage = image || (matchedKey ? HERO_IMAGES[matchedKey] : null);

  // When a photo banner is used, layer a left→right navy scrim over it so the
  // text zone stays legible over ANY artwork while the right-side subject stays clear.
  const photoStyle = heroImage
    ? {
        backgroundColor: "#0a1a3f",
        backgroundImage: `linear-gradient(90deg, rgba(10, 26, 63, 0.86) 0%, rgba(10, 26, 63, 0.58) 38%, rgba(10, 26, 63, 0.22) 55%, rgba(10, 26, 63, 0) 72%), url("${heroImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
      }
    : {};

  return (
    <section className={`page-banner ${heroImage ? "page-banner--photo" : ""} ${className}`} style={{ ...photoStyle, ...style }}>
      <div className="container">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="page-banner__crumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="page-banner__crumbs-sep">/</span>}
                {crumb.path ? <Link href={crumb.path}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
              </React.Fragment>
            ))}
          </nav>
        )}
        {eyebrow && <span className="page-banner__eyebrow">{eyebrow}</span>}
        <h1 className="page-banner__title">
          {titleParts.join(" ")} {titleLast && <span>{titleLast}</span>}
        </h1>
        {subtitle && <p className="page-banner__subtitle">{subtitle}</p>}
        {facts && facts.length > 0 && (
          <ul className="page-banner__facts">
            {facts.map((f, idx) => (
              <li key={idx}>{f}</li>
            ))}
          </ul>
        )}
        {children}
      </div>
    </section>
  );
};

export default PageBanner;
