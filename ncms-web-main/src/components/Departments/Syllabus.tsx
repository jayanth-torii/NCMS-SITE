"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import syllabusContentsData from "@/data-export/syllabus-contents/data.json";
import { getSyllabusContents } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

interface ProgrammeContentProps {
  programme?: string;
  onSyllabusContentCheck?: (hasContent: boolean) => void;
}

const Syllabus = ({ programme: programmeProp, onSyllabusContentCheck }: ProgrammeContentProps) => {
  const { data: departmentsSyllabusData } = useLiveData(getSyllabusContents, syllabusContentsData as any);
  const [activeTabId, setActiveTabId] = useState(0);

  const searchParams = useSearchParams();
  const programme = programmeProp ?? searchParams.get("programme") ?? "";
  const normalizedProgramme = programme.toLowerCase().replace(/&/g, "and").trim();

  // departmentKeyMap to match API keys
  const departmentKeyMap: Record<string, string> = {
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

  const deptKey = departmentKeyMap[normalizedProgramme];
  const content = departmentsSyllabusData?.[deptKey];

  useEffect(() => {
    const matched = departmentsSyllabusData?.[deptKey];
    onSyllabusContentCheck?.(!!(matched && matched.SyllabusSection && matched.SyllabusSection.length > 0));
  }, [departmentsSyllabusData, normalizedProgramme]);

  if (!content || !content.SyllabusSection || content.SyllabusSection.length === 0) {
    return (
      <div className="dept-tab-pane pane-academics">
        <div className="empty-message-box">
          No Syllabus available for <strong>{programme}</strong>.
        </div>
      </div>
    );
  }

  const groups = content.SyllabusSection;
  const clampedTab = Math.min(activeTabId, groups.length - 1);
  const activeGroup = groups[clampedTab] || groups[0];

  // Build timeline items for the active group
  const timelineItems = (activeGroup.Sections || []).map((item: any) => ({
    subtitle: activeGroup.title || "Syllabus",
    title: item.title,
    link: item.pdf || item.link || "#",
  }));

  return (
    <div className="dept-tab-pane pane-academics">
      <div className="nisp-interactive-container">
        {/* Sidebar */}
        <div className="nisp-sidebar">
          {groups.map((group: any, idx: number) => (
            <div
              key={idx}
              className={`nisp-tab ${clampedTab === idx ? "active" : ""}`}
              onClick={() => setActiveTabId(idx)}
            >
              <div className="nisp-tab-number">{String(idx + 1).padStart(2, "0")}</div>
              <div className="nisp-tab-label">{group.title}</div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="nisp-content-area">
          <div className="nisp-content-header">
            <h3 className="nisp-content-title">{activeGroup.title}</h3>
            <p className="nisp-content-desc">Explore the latest syllabus details and resources below.</p>
          </div>

          <div className="nisp-timeline" key={clampedTab}>
            {timelineItems.map((item: any, idx: number) => (
              <div key={idx} className="nisp-timeline-item" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="nisp-timeline-node">
                  <span>{String(idx + 1).padStart(2, "0")}</span>
                </div>
                <a href={item.link} target="_blank" rel="noreferrer" className="nisp-timeline-card">
                  <div className="nisp-card-subtitle">{item.subtitle}</div>
                  <div className="nisp-card-title">{item.title}</div>
                </a>
              </div>
            ))}
            {timelineItems.length === 0 && (
              <p style={{ color: "#64748b", fontStyle: "italic" }}>No documents available for this section.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Syllabus;
