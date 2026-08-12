"use client";

import React, { Suspense } from "react";
import Link from "next/link";

import DepartmentTabs from "./DepartmentTabs";

import departmentBannersData from "@/data-export/department-banners/data.json";
import { getDepartmentBanners } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";
import {
  deptProgrammeToBannerKey,
  deptTabLabel,
  formatDeptTitle,
  getDeptCategory,
} from "@/lib/departments";

interface DepartmentShellProps {
  /** URL slug segment, e.g. "masters-in-business-administration" */
  id: string;
  /** Normalized programme name (slug with dashes -> spaces) */
  programme: string;
  /** Active tab id, default "about" */
  tab?: string;
}

const DepartmentShell = ({ id, programme, tab = "about" }: DepartmentShellProps) => {
  const { data: bannersData } = useLiveData(getDepartmentBanners, departmentBannersData as any);
  const banners: any = bannersData || (departmentBannersData as any).data || departmentBannersData;

  const bannerKey = deptProgrammeToBannerKey(programme);
  const content: any = bannerKey ? banners?.[bannerKey] : null;
  const dTitle = content?.title || formatDeptTitle(programme);
  const category = getDeptCategory(bannerKey || "");

  return (
    <div className="departments-page-root dept-details-root dept-details-page">
      {/* Decorative outer background — shades + geometric shapes */}
      <div className="dept-page-decor" aria-hidden="true">
        <div className="dept-page-gradient"></div>
        <div className="dept-page-dots"></div>
        <div className="dept-pane-glow dept-pane-glow-orange"></div>
        <div className="dept-pane-glow dept-pane-glow-blue"></div>
        <div className="dept-pane-glow dept-pane-glow-navy"></div>
        <div className="dept-pane-shape dept-pane-circle"></div>
        <div className="dept-pane-shape dept-pane-ring"></div>
        <div className="dept-pane-shape dept-pane-triangle"></div>
        <div className="dept-pane-shape dept-pane-diamond"></div>
        <div className="dept-pane-shape dept-pane-diamond-blue"></div>
        <div className="dept-pane-shape dept-pane-plus"></div>
        <div className="dept-pane-shape dept-pane-plus-blue"></div>
      </div>

      <div className="dept-page-content">
      {/* Breadcrumbs — Home / Departments / Level / Department */}
      <nav className="dept-breadcrumbs">
        <Link href="/" className="breadcrumb-home-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
          </svg>
        </Link>
        <div className="breadcrumb-item-container">
          <span className="breadcrumb-separator">/</span>
          <Link href="/departments" className="breadcrumb-nav-link">Departments</Link>
        </div>
        {category.param && (
          <div className="breadcrumb-item-container">
            <span className="breadcrumb-separator">/</span>
            <Link href={`/departments?tab=${category.param}`} className="breadcrumb-nav-link">{category.name}</Link>
          </div>
        )}
        <div className="breadcrumb-item-container">
          <span className="breadcrumb-separator">/</span>
          {tab !== "about" ? (
            <Link href={`/department/${id}`} className="breadcrumb-nav-link">{dTitle}</Link>
          ) : (
            <span className="breadcrumb-current">{dTitle}</span>
          )}
        </div>
        {tab !== "about" && (
          <div className="breadcrumb-item-container">
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{deptTabLabel(tab)}</span>
          </div>
        )}
      </nav>

      {/* Navy hero card */}
      <div style={{ padding: "0 1rem", maxWidth: "1200px", margin: "2rem auto 2.5rem auto" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background: "#0e2455",
            borderRadius: "24px",
            padding: "3.5rem 3rem",
            color: "#ffffff",
            boxShadow: "0 10px 30px rgba(14, 36, 85, 0.15)",
          }}
        >
          {/* Background Shapes */}
          <svg style={{ position: "absolute", right: "-50px", top: "-50px", width: "300px", height: "300px", opacity: "0.05" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F6872A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>

          <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
            <div style={{ display: "inline-block", padding: "0.4rem 1rem", background: "rgba(246, 135, 42, 0.15)", border: "1px solid rgba(246, 135, 42, 0.3)", borderRadius: "50px", color: "#F6872A", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>
              Academic Department
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, margin: "0 0 1rem 0", lineHeight: 1.1, letterSpacing: "-1px", color: "#ffffff" }}>
              {dTitle}
            </h1>
            <p style={{ fontSize: "1.1rem", color: "rgba(255, 255, 255, 0.8)", margin: 0, fontWeight: 500, lineHeight: 1.6 }}>
              Exploring excellence in education, research, and innovation.
            </p>
          </div>
        </div>
      </div>

      {/* Pill tabs + content */}
      <Suspense fallback={<p>Loading…</p>}>
        <DepartmentTabs id={id} programme={programme} tab={tab} />
      </Suspense>
      </div>
    </div>
  );
};

export default DepartmentShell;
