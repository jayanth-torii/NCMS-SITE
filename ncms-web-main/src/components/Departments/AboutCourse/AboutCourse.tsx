"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

import courseContentsData from "@/data-export/course-contents/data.json";
import { getCourseContents } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

// Department mapping
const contentMapping: Record<string, string> = {
  "science": "Science",
  "commerce and management": "UG_Commerce",
  "computer application": "UG_CA",
  "masters in business administration": "MBA",
  "masters of commerce": "MOC",
  "masters of computer application": "MCA",
  "department of kannada": "DOK",
  "department of hindi": "DOH",
  "department of english": "DOE",
};

const AboutCourse = ({ programme: programmeProp }: { programme?: string }) => {
  const searchParams = useSearchParams();
  const programme = programmeProp ?? searchParams.get("programme") ?? "";
  const [isExpanded, setIsExpanded] = useState(false);

  const normalizedProgramme = programme.toLowerCase().replace(/&/g, "and").trim();
  const departmentKey = contentMapping[normalizedProgramme];

  const { data: aboutCourseData } = useLiveData(getCourseContents, courseContentsData as any);

  const departmentData = aboutCourseData?.[departmentKey];

  if (!departmentData) {
    return (
      <div className="dept-tab-pane pane-about" style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div className="empty-message-box">
          No course data available for this department.
        </div>
      </div>
    );
  }

  const paragraphs = departmentData.about || [];
  const visibleParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 1);

  return (
    <div className="dept-tab-pane pane-about" style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* 1. About Overview (Flat Card) */}
      <div style={{ padding: "2.5rem 2rem", background: "#ffffff", borderRadius: "24px", boxShadow: "0 4px 20px rgba(14, 36, 85, 0.05)" }}>
        <h2 style={{ fontSize: "1.6rem", color: "#0e2455", fontWeight: 800, margin: "0 0 1rem 0", letterSpacing: "-0.5px" }}>
          {departmentData.title || "Department Overview"}
        </h2>
        <div style={{ fontSize: "0.95rem", color: "#475569", lineHeight: 1.6 }}>
          {visibleParagraphs.map((para: string, pIdx: number) => (
            <p key={pIdx} style={{ marginBottom: "0.8rem" }}>{para}</p>
          ))}
        </div>
        {paragraphs.length > 1 && (
          <button className="premium-btn" onClick={() => setIsExpanded(!isExpanded)}>
            <span>{isExpanded ? "Show Less" : "Read More"}</span>
            <svg
              className={isExpanded ? "rotated" : ""}
              style={{ width: "16px", height: "16px" }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AboutCourse;
