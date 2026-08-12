"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import MenuItems from "./MenuItems";

// NCMS brand logo (matches live site + admin) — NOT the NCET logo
const NCMS_LOGO = "/images/NGE-Logo.png";
const ACCRED_LOGOS = [
  "/images/accreditations_4_3a79d275b5.png",
  "/images/accreditations_2_e159c4432f.png",
];

const WHATSAPP_LINK =
  "https://wa.me/917022014433?text=Hi,%20I%20am%20looking%20for%20admissions,%20can%20I%20get%20more%20info?";

// The NCMS brand logo stays fixed; the accreditation badges cross-fade in a
// slot next to it (exact NCET RotatingLogo behaviour).
const RotatingLogo = ({ logo, badges }: { logo?: string; badges?: string[] }) => {
  const [active, setActive] = useState(0);
  const mainLogo = logo || NCMS_LOGO;
  const list = badges && badges.length ? badges : ACCRED_LOGOS;
  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % list.length), 2800);
    return () => clearInterval(id);
  }, [list.length]);
  return (
    <span className="logo-pair">
      <img className="unified-logo" src={mainLogo} alt="Nagarjuna College of Management Studies" />
      <span className="unified-logo logo-rotator logo-rotator--badge" aria-hidden="true">
        <img className="logo-rotator__sizer" src={list[0]} alt="" />
        {list.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="NCMS accreditation"
            className={`logo-rotator__img ${i === active ? "is-active" : ""}`}
          />
        ))}
      </span>
    </span>
  );
};

const Header = ({ parentMenu }: { parentMenu?: string }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Sticky is displayed after scrolling for 100 pixels
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 100);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header id="react-header" className="react-header react-header-three">
        <div className={isVisible ? "header-area react-sticky" : "header-area"}>
          <div className="topbar-area style1 unified-topbar" style={{ padding: "0", background: "#ffffff", width: "100%" }}>
            <div className="container">
              <div className="react-main-menu">
                <nav className={`custom-unified-header custom-unified-header--compact ${menuOpen ? "drawer-open" : ""}`}>
                  <div className="menu-toggle logo-section">
                    <div className="logo">
                      <Link href="/" className="logo-text">
                        <RotatingLogo />
                      </Link>
                    </div>
                    <button
                      type="button"
                      id="menu-btn"
                      className={menuOpen ? "mobile-menu-btn open" : "mobile-menu-btn"}
                      aria-label="Open menu"
                      aria-expanded={menuOpen}
                      onClick={() => setMenuOpen(!menuOpen)}
                    >
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                    </button>
                  </div>

                  <div className={`menu-section ${menuOpen ? "react-inner-menus menu-open" : "react-inner-menus"}`}>
                    <div className="drawer-head">
                      <Link href="/" className="drawer-logo-link">
                        <RotatingLogo />
                      </Link>
                      <button type="button" className="drawer-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                        &times;
                      </button>
                    </div>
                    <ul id="backmenu" className="react-menus react-sub-shadow">
                      <MenuItems parentMenu={parentMenu} />
                    </ul>
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="drawer-cta">
                      <FontAwesomeIcon icon={faWhatsapp} /> Get Help on WhatsApp
                    </a>
                  </div>

                  <div className="header-cta-btn">
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="wa-help-btn" aria-label="Get help on WhatsApp">
                      <FontAwesomeIcon icon={faWhatsapp} className="wa-icon" /> Get Help
                    </a>
                  </div>

                  <div
                    className={`mobile-nav-overlay ${menuOpen ? "is-open" : ""}`}
                    onClick={() => setMenuOpen(false)}
                    aria-hidden="true"
                  ></div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
