"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import programContentsData from "@/data-export/program-contents/data.json";
import { getProgramContents } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

interface ProgrammeContentProps {
  programme?: string;
  onProgrammeContentCheck?: (hasContent: boolean) => void;
}

// Build a short badge prefix from a section title, e.g. "PEOs" -> "PEO", "POs" -> "PO", "PSOs" -> "PSO"
const badgePrefix = (title: string) => {
  const t = title.replace(/\s+/g, " ").trim();
  const m = t.match(/^(PEOs|POs|PSOs|PEO|PO|PSO)\b/i);
  if (m) return m[1].replace(/s$/i, "");
  // Fallback: keep first 3 words, strip trailing "s"
  const words = t.split(" ").slice(0, 3).join(" ");
  return words.replace(/s$/i, "");
};

const PeosPosPsos = ({ programme: programmeProp, onProgrammeContentCheck }: ProgrammeContentProps) => {
  const { data: programsData } = useLiveData(getProgramContents, programContentsData as any);
  const [activeTab, setActiveTab] = useState(0);

  const searchParams = useSearchParams();
  const programme = programmeProp ?? searchParams.get("programme") ?? "";
  const normalizedProgramme = programme.trim().toLowerCase().replace(/&/g, "and");

  // Map department name to content key
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
  const departmentData = programsData?.[deptKey];

  const tabs = departmentData?.Program_Contents?.map((section: any) => section.title) || [];
  const activeSection = departmentData?.Program_Contents?.[activeTab];

  useEffect(() => {
    if (programsData) {
      const deptKey = departmentKeyMap[normalizedProgramme];
      const hasDepartment = deptKey && programsData.hasOwnProperty(deptKey);
      onProgrammeContentCheck?.(hasDepartment);
    }
  }, [programsData, normalizedProgramme]);

  return (
    <div className="dept-tab-pane" style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}>
      {tabs.length > 0 ? (
        <div style={{ padding: "2.5rem 2rem", background: "#ffffff", borderRadius: "24px", boxShadow: "0 4px 20px rgba(14, 36, 85, 0.05)" }}>
          {/* Header + pill tabs */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.6rem", color: "#0e2455", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
              {departmentData?.title || "Programme Outcomes"}
            </h2>
            <div style={{ display: "flex", gap: "0.5rem", background: "#f8fafc", padding: "0.35rem", borderRadius: "50px" }}>
              {tabs.map((tab: string, index: number) => (
                <button
                  key={index}
                  style={{
                    padding: "0.5rem 1.2rem",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    borderRadius: "50px",
                    border: "none",
                    background: activeTab === index ? "#F6872A" : "transparent",
                    color: activeTab === index ? "#ffffff" : "#64748b",
                    boxShadow: activeTab === index ? "0 4px 10px rgba(246, 135, 42, 0.2)" : "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => setActiveTab(index)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
            <div className="animate-fade-in" key={activeTab}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "1rem" }}>
                {activeSection?.Sections?.map((point: string, idx: number) => (
                  <li key={idx} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", fontSize: "0.9rem", color: "#475569", lineHeight: 1.6 }}>
                    <div
                      style={{
                        flexShrink: 0,
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        color: "#0e2455",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        marginTop: "2px",
                      }}
                    >
                      {badgePrefix(activeSection?.title || "Outcome")} {idx + 1}
                    </div>
                    <p style={{ margin: 0 }}>{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-message-box">
          No data found for <strong>{programme}</strong>.
        </div>
      )}
    </div>
  );
};

export default PeosPosPsos;
