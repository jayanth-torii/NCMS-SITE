"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import visionMissionsData from "@/data-export/vision-missions/data.json";
import { getVisionMissions } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

export default function VisionMission({ programme: programmeProp }: { programme?: string }) {
  const { data: visionMissionData } = useLiveData(getVisionMissions, visionMissionsData as any);

  const searchParams = useSearchParams();
  const programme = programmeProp ?? searchParams.get("programme") ?? "";
  const normalizedProgramme = programme.toLowerCase().replace(/&/g, "and").trim();

  if (!visionMissionData) {
    return <p style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Loading...</p>;
  }

  // Map department keys correctly
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

  const departmentKey = contentMapping[normalizedProgramme];
  const departmentData = visionMissionData[departmentKey];

  if (!departmentData?.VisionMission) {
    return (
      <div className="dept-tab-pane" style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div className="empty-message-box">Programme content not found.</div>
      </div>
    );
  }

  const sections = departmentData.VisionMission;
  const vision = sections.find((s: any) => /vision/i.test(s.title || ""));
  const mission = sections.find((s: any) => /mission/i.test(s.title || ""));
  const missionPoints = mission
    ? mission.points?.length
      ? mission.points
      : mission.description
        ? [mission.description]
        : []
    : [];

  return (
    <div className="dept-tab-pane" style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* Vision & Mission navy card */}
      <div
        style={{
          background: "#0e2455",
          color: "#ffffff",
          padding: "2.5rem",
          borderRadius: "24px",
          boxShadow: "0 10px 30px rgba(14, 36, 85, 0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative watermark */}
        <svg
          style={{ position: "absolute", right: "-50px", bottom: "-50px", width: "300px", height: "300px", opacity: "0.05" }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F6872A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>

        {vision && (
          <div style={{ marginBottom: "2rem", position: "relative", zIndex: 1, maxWidth: "900px" }}>
            <h2 style={{ fontSize: "1.8rem", fontFamily: '"Poppins", sans-serif', fontWeight: 700, margin: "0 0 0.5rem 0", letterSpacing: "-0.5px", color: "#ffffff" }}>
              Our Vision
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.95)", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              {vision.description}
            </p>
          </div>
        )}

        {mission && (
          <div style={{ position: "relative", zIndex: 1, maxWidth: "900px" }}>
            <h2 style={{ fontSize: "1.8rem", fontFamily: '"Poppins", sans-serif', fontWeight: 600, margin: "0 0 1rem 0", letterSpacing: "-0.5px", color: "#ffffff" }}>
              Our Mission
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {missionPoints.map((line: string, idx: number) => (
                <li key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "0.95rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.6, fontWeight: 400 }}>
                  <svg style={{ flexShrink: 0, marginTop: "4px" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F6872A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
