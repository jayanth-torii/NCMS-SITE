"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faLinkedinIn, faInstagram, faYoutube, faFacebookF } from "@fortawesome/free-brands-svg-icons";
import footerDataStatic from "@/data-export/footer/data.json";
import { getFooter } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

// Social icon key → FontAwesome brand icon.
const SOCIAL_ICONS: Record<string, any> = {
  linkedin: faLinkedinIn,
  linkedinIn: faLinkedinIn,
  x: faXTwitter,
  twitter: faXTwitter,
  instagram: faInstagram,
  youtube: faYoutube,
  facebook: faFacebookF,
  facebookF: faFacebookF,
};

/* ---------- inline icons (stroked SVG) ---------- */
const svg = (d: any, extra?: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {Array.isArray(d) ? d.map((p: string, i: number) => <path key={i} d={p} />) : <path d={d} />}
    {extra}
  </svg>
);
const IcoLinks = () => svg(["M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"]);
const IcoCap = () => svg(["M22 10 12 5 2 10l10 5 10-5Z", "M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5"]);
const IcoReport = () => svg(["M9 17v-5m3 5v-3m3 5v-7", "M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"]);
const IcoShield = () => svg("M12 3l8 4v5c0 4.5-3.4 7.8-8 9-4.6-1.2-8-4.5-8-9V7l8-4z");
const IcoChevR = () => svg("M9 6l6 6-6 6");
const IcoChevD = () => svg("M6 9l6 6 6-6");
const IcoArrowUR = () => svg(["M7 17 17 7", "M8 7h9v9"]);
const IcoClose = () => svg(["M6 6l12 12", "M18 6 6 18"]);
const IcoPhone = () => svg("M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z");
const IcoMail = () => svg(["M3 8l7.89 5.26a2 2 0 002.22 0L21 8", "M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"]);
const IcoPin = () => svg(["M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", "M15 11a3 3 0 11-6 0 3 3 0 016 0z"]);

type FooterLinkItem = {
  id: number;
  title: string;
  type?: string;
  link?: string | null;
  pdf_link?: string | null;
};

const CLAMP = 3;

const COLUMN_DEFS = [
  { id: "importantLinks", title: "Important Links", Icon: IcoLinks },
  { id: "acadamics", title: "Academics", Icon: IcoCap },
  { id: "reports_and_publications", title: "Reports & Publications", Icon: IcoReport },
  { id: "policies", title: "Policies & Guidelines", Icon: IcoShield },
];

const FooterLink = ({ link }: { link: FooterLinkItem }) => {
  const href = link.link || link.pdf_link || "#";
  const isPdf = link.type === "pdf" && !!link.pdf_link;
  const isExternal = /^https?:/.test(href) || isPdf;
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        <span>{link.title}</span>
        <IcoChevR />
      </a>
    );
  }
  return (
    <Link href={href}>
      <span>{link.title}</span>
      <IcoChevR />
    </Link>
  );
};

const Footer = () => {
  const year = new Date().getFullYear();
  const { data: footerData } = useLiveData(getFooter, footerDataStatic as any);
  const d: any = footerData || (footerDataStatic as any).data || footerDataStatic;

  const contactInfo = d?.contactInfo || {};
  const phones = String(contactInfo.phone || "")
    .split("|")
    .map((p: string) => p.trim())
    .filter(Boolean);
  const emails = String(contactInfo.email || "")
    .split(",")
    .map((e: string) => e.trim())
    .filter(Boolean);
  const follow: { title: string; link: string }[] = d?.follow || [];

  // Per-column open state — drives the desktop "view all" popover AND the
  // mobile tap-to-expand accordion (CSS decides which presentation shows).
  const [openCols, setOpenCols] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setOpenCols((p) => ({ ...p, [id]: !p[id] }));
  const anyOpen = Object.values(openCols).some(Boolean);

  // Close on outside click / Escape (mainly for the desktop popover).
  useEffect(() => {
    if (!anyOpen) return undefined;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".ftr-col")) setOpenCols({});
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenCols({});
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [anyOpen]);

  return (
    <footer id="react-footer" className="ncet-footer">
      <div className="ftr-collapse">
        <span className="ftr-watermark" aria-hidden="true">
          NCMS
        </span>
        <div className="ftr-container ftr-upper">
          <div className="ftr-grid">
            {/* Contact column: vertical Follow-us strip + contact cards */}
            <div className="ftr-contactcol">
              <div className="ftr-follow-vert">
                <span className="ftr-follow-vert__label">Follow Us</span>
                <ul className="ftr-social ftr-social--vert">
                  {follow.map((s) => (
                    <li key={s.title || s.link}>
                      <a href={s.link} target="_blank" rel="noopener noreferrer" aria-label={s.title}>
                        <FontAwesomeIcon icon={SOCIAL_ICONS[s.title.toLowerCase()] || SOCIAL_ICONS[(s.title || "").replace(/\s+/g, "").toLowerCase()] || faFacebookF} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="ftr-contact">
                <li className="ftr-contact__card">
                  <span className="ftr-contact__icon">
                    <IcoPhone />
                  </span>
                  <span className="ftr-contact__body">
                    <span className="ftr-contact__label">Phone</span>
                    <span className="ftr-contact__value">
                      {phones.map((n: string, i: number) => (
                        <React.Fragment key={i}>
                          {i > 0 && ", "}
                          <a href={`tel:${n.replace(/\s+/g, "")}`}>{n}</a>
                        </React.Fragment>
                      ))}
                    </span>
                  </span>
                </li>
                <li className="ftr-contact__card">
                  <span className="ftr-contact__icon">
                    <IcoMail />
                  </span>
                  <span className="ftr-contact__body">
                    <span className="ftr-contact__label">Email</span>
                    <span className="ftr-contact__value">
                      {emails.map((e: string, i: number) => (
                        <React.Fragment key={i}>
                          {i > 0 && ", "}
                          <a href={`mailto:${e}`}>{e}</a>
                        </React.Fragment>
                      ))}
                    </span>
                  </span>
                </li>
                <li className="ftr-contact__card">
                  <span className="ftr-contact__icon">
                    <IcoPin />
                  </span>
                  <span className="ftr-contact__body">
                    <span className="ftr-contact__label">Address</span>
                    <span className="ftr-contact__value">
                      {contactInfo.address_link ? (
                        <a href={contactInfo.address_link} target="_blank" rel="noopener noreferrer">
                          {contactInfo.address}
                        </a>
                      ) : (
                        contactInfo.address
                      )}
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Link columns */}
            {COLUMN_DEFS.map((col) => {
              const isOpen = !!openCols[col.id];
              const Icon = col.Icon;
              const links: FooterLinkItem[] = d?.[col.id] || [];
              const hasMore = links.length > CLAMP;
              return (
                <div className={`ftr-col ${isOpen ? "is-open" : ""}`} key={col.id}>
                  <button
                    type="button"
                    className="ftr-col__head"
                    aria-expanded={isOpen}
                    onClick={() => {
                      if (window.matchMedia("(max-width: 640px)").matches) toggle(col.id);
                    }}
                  >
                    <span className="ftr-col__icon">
                      <Icon />
                    </span>
                    <span className="ftr-col__title">{col.title}</span>
                    <span className="ftr-col__caret">
                      <IcoChevD />
                    </span>
                  </button>
                  <ul className="ftr-col__list">
                    {links.slice(0, CLAMP).map((link, i) => (
                      <li key={i}>
                        <FooterLink link={link} />
                      </li>
                    ))}
                  </ul>
                  {hasMore && (
                    <button type="button" className="ftr-col__viewall" onClick={() => toggle(col.id)} aria-expanded={isOpen}>
                      View all <IcoArrowUR />
                    </button>
                  )}

                  {hasMore && (
                    <div className={`ftr-col__popup ${isOpen ? "is-open" : ""}`} role="dialog" aria-label={col.title} aria-hidden={!isOpen}>
                      <div className="ftr-col__popup-head">
                        <span>{col.title}</span>
                        <button type="button" className="ftr-col__popup-close" onClick={() => toggle(col.id)} aria-label="Close">
                          <IcoClose />
                        </button>
                      </div>
                      <ul className="ftr-col__popup-list">
                        {links.map((link, i) => (
                          <li key={i}>
                            <FooterLink link={link} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom bar — always visible */}
      <div className="ftr-bottom">
        <div className="ftr-container ftr-bottom__inner">
          <div className="ftr-bottom__left">
            <img className="ftr-bottom__ngi" src="/images/NGI_Logo_d53c56dedc_11eae0a723.png" alt="Nagarjuna College of Management Studies" />
            <p className="ftr-bottom__copy">
              {"©"} {year}{" "}
              <b>
                <span className="ftr-copy-full">Nagarjuna College of Management Studies</span>
                <span className="ftr-copy-short">NCMS</span>
              </b>
              . All Rights Reserved.
            </p>
          </div>
          <div className="ftr-bottom__right">
            <div className="ftr-bottom__powered">
              <span>Powered by</span>
              <a href="https://toriiminds.com/" target="_blank" rel="noopener noreferrer" aria-label="Torii Minds">
                <img src="/images/tori-logo-dark.png" alt="Torii Minds" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
