"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuItems = ({ parentMenu }: { parentMenu?: string }) => {
  const pathname = usePathname();

  // Active state for each top-level tab (desktop CSS mega-menu + mobile accordion)
  const [page, setPage] = useState(false);
  const [about, setAbout] = useState(false);
  const [academics, setAcademics] = useState(false);
  const [students, setStudents] = useState(false);
  const [news, setNews] = useState(false);
  const [offered, setOffered] = useState(false);
  const [fees, setFees] = useState(false);

  const openMobileMenu = (menu: string) => {
    if (menu === "page") {
      setPage((prev) => !prev);
      if (page) {
        setOffered(false);
        setFees(false);
        return;
      }
    }
    if (menu === "offered") {
      setOffered((prev) => !prev);
      return;
    }
    if (menu === "fees") {
      setFees((prev) => !prev);
      return;
    }
    if (menu === "about") {
      setAbout((prev) => !prev);
      setAcademics(false);
      return;
    }
    if (menu === "academics") {
      setAcademics((prev) => !prev);
      return;
    }
    if (menu === "students") {
      setStudents((prev) => !prev);
      return;
    }
    if (menu === "news") {
      setNews((prev) => !prev);
      return;
    }
  };

  const isActive = (paths: string[]) => paths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const liActive = (paths: string[]) => (isActive(paths) ? "has-sub menu-active" : "has-sub");
  const linkActive = (paths: string[]) => (isActive(paths) ? "menu-active" : "");

  return (
    <>
      <li className={pathname === "/" ? "menu-active" : ""}>
        <Link href="/" className={pathname === "/" ? "active" : ""}>
          Home
        </Link>
      </li>

      {/* About NCMS */}
      <li className={isActive(["/about-ncms", "/mandatory-disclosure", "/audit-reports"]) || parentMenu === "about" ? "has-sub menu-active" : "has-sub"}>
        <Link href="#" className={about ? "hash menu-active" : "hash"} onClick={() => openMobileMenu("about")}>
          About NCMS
          <span className="arrow"></span>
        </Link>
        <ul className={about ? "sub-menu sub-menu-open" : "sub-menu"}>
          <li className={linkActive(["/about-ncms"])}>
            <Link href="/about-ncms">About NCMS</Link>
          </li>
          <li className={linkActive(["/mandatory-disclosure"])}>
            <Link href="/mandatory-disclosure">Mandatory Disclosure</Link>
          </li>
          <li className={linkActive(["/audit-reports"])}>
            <Link href="/audit-reports">Audit Reports</Link>
          </li>
        </ul>
      </li>

      {/* Academics */}
      <li className={isActive(["/departments", "/uucms", "/iqac", "/gallery", "/syllabus", "/program-content"]) || parentMenu === "academics" ? "has-sub menu-active" : "has-sub"}>
        <Link href="#" className={academics ? "hash menu-active" : "hash"} onClick={() => openMobileMenu("academics")}>
          Academics
          <span className="arrow"></span>
        </Link>
        <ul className={academics ? "sub-menu sub-menu-open" : "sub-menu"}>
          <li className={linkActive(["/departments"])}>
            <Link href="/departments">Departments</Link>
          </li>
          <li className={liActive(["/uucms"])}>
            <Link href="#" className={offered ? "hash menu-active" : "hash"} onClick={(e) => { e.preventDefault(); openMobileMenu("offered"); }}>
              UUCMS
              <FaChevronDown className={`arrow-icon arrow arrow-icon-new ${offered ? "rotate" : ""}`} />
            </Link>
            <ul className={offered ? "sub-menu sub-menu-open" : "sub-menu"}>
              <li className={linkActive(["/uucms"])}>
                <Link href="/uucms">College Manual</Link>
              </li>
              <li className={linkActive(["/uucms/login-portals"])}>
                <Link href="/uucms/login-portals">Login Portals</Link>
              </li>
            </ul>
          </li>
          <li className={linkActive(["/iqac"])}>
            <Link href="/iqac">IQAC</Link>
          </li>
          <li className={linkActive(["/gallery"])}>
            <Link href="/gallery">Gallery</Link>
          </li>
        </ul>
      </li>

      {/* Students */}
      <li className={isActive(["/student-center", "/placements", "/iic"]) || parentMenu === "students" ? "has-sub menu-active" : "has-sub"}>
        <Link href="#" className={students ? "hash menu-active" : "hash"} onClick={() => openMobileMenu("students")}>
          Students
          <span className="arrow"></span>
        </Link>
        <ul className={students ? "sub-menu sub-menu-open" : "sub-menu"}>
          <li className={linkActive(["/student-center"])}>
            <Link href="/student-center">Student Center</Link>
          </li>
          <li className={linkActive(["/placements"])}>
            <Link href="/placements">Placements</Link>
          </li>
          <li className={linkActive(["/iic"])}>
            <Link href="/iic">IIC</Link>
          </li>
        </ul>
      </li>

      {/* News & Media */}
      <li className={isActive(["/events", "/blog", "/news-clippings", "/news-letter", "/samashti"]) || parentMenu === "news" ? "has-sub menu-active" : "has-sub"}>
        <Link href="#" className={news ? "hash menu-active" : "hash"} onClick={() => openMobileMenu("news")}>
          News &amp; Media
          <span className="arrow"></span>
        </Link>
        <ul className={news ? "sub-menu sub-menu-open" : "sub-menu"}>
          <li className={linkActive(["/events"])}>
            <Link href="/events">Events</Link>
          </li>
          <li className={linkActive(["/blog"])}>
            <Link href="/blog">Blog</Link>
          </li>
          <li className={linkActive(["/news-clippings"])}>
            <Link href="/news-clippings">News Clippings</Link>
          </li>
          <li className={linkActive(["/news-letter"])}>
            <Link href="/news-letter">News Letter</Link>
          </li>
          <li className={linkActive(["/samashti"])}>
            <Link href="/samashti">Samashti</Link>
          </li>
        </ul>
      </li>

      <li className={pathname === "/contact-us" ? "menu-active" : ""}>
        <Link href="/contact-us">Contact Us</Link>
      </li>
    </>
  );
};

export default MenuItems;
