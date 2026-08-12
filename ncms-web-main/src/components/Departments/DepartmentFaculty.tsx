"use client";

import { useSearchParams } from "next/navigation";
import facultyDataJson from "@/data-export/department-faculties/data.json";
import { getDepartmentFaculties } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

export default function DepartmentFaculty({ programme: programmeProp }: { programme?: string }) {
  const searchParams = useSearchParams();
  const programme = programmeProp ?? searchParams.get("programme") ?? "";

  const { data: facultyData } = useLiveData(
    getDepartmentFaculties,
    facultyDataJson as Record<string, any>
  ) as { data: Record<string, any> };

  const normalizedProgramme = programme.toLowerCase().replace(/&/g, "and").trim();

  const contentMapping: Record<string, string> = {
    "commerce and management": "UG_Commerce",
    "computer application": "UG_CA",
    "science": "Science",
    "masters in business administration": "MBA",
    "masters of commerce": "MOC",
    "masters of computer application": "MCA",
    "department of kannada": "DOK",
    "department of hindi": "DOH",
    "department of english": "DOE",
  };

  const departmentKey = contentMapping[normalizedProgramme];
  const department = departmentKey ? facultyData[departmentKey] : null;

  const content = department?.members || [];

  if (!department || !content.length) {
    return (
      <div className="dept-tab-pane pane-faculty">
        <div className="empty-message-box">
          No faculty data available for <strong>{programme}</strong>.
        </div>
      </div>
    );
  }

  return (
    <div className="dept-tab-pane pane-faculty">
      <div className="premium-academic-layout" style={{ padding: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem" }}>
          {content.map((fMember: any, idx: number) => {
            const bio = Array.isArray(fMember.about)
              ? fMember.about.join(" ")
              : fMember.bio || "Detailed bio coming soon.";
            const links = Array.isArray(fMember.details)
              ? fMember.details.filter((l: any) => l?.content && /^https?:/.test(l.content))
              : [];

            return (
              <div key={idx} className="faculty-flip-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="faculty-flip-card-inner">
                  {/* FRONT */}
                  <div className="faculty-flip-card-front">
                    <div style={{ width: "120px", height: "120px", borderRadius: "50%", overflow: "hidden", border: "4px solid #f1f5f9", boxShadow: "0 8px 20px rgba(0,0,0,0.06)", marginBottom: "1.2rem" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={fMember.image} alt={fMember.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "center" }}>
                      <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0e2455", margin: 0, lineHeight: 1.2 }}>{fMember.name}</h4>
                      <p style={{ fontSize: "0.9rem", color: "#F6872A", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{fMember.designation}</p>
                      <p style={{ fontSize: "0.85rem", color: "#334155", fontWeight: 600, margin: 0, lineHeight: 1.2 }}>{fMember.qualification}</p>
                    </div>
                  </div>

                  {/* BACK */}
                  <div className="faculty-flip-card-back">
                    <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: "1rem", paddingRight: "0.5rem", width: "100%" }}>
                      <p style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: 0, textAlign: "center", color: "#f1f5f9" }}>{bio}</p>
                      {fMember.listOfPublications?.content?.length > 0 && (
                        <p style={{ fontSize: "0.8rem", lineHeight: 1.5, margin: "0.9rem 0 0 0", textAlign: "center", color: "rgba(255,255,255,0.65)" }}>
                          {fMember.listOfPublications.title}: {fMember.listOfPublications.content.join(" · ")}
                        </p>
                      )}
                    </div>

                    {links.length > 0 && (
                      <div className="social-links" style={{ display: "flex", gap: "10px", justifyContent: "center", width: "100%", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
                        {links.map((l: any, i: number) => (
                          <a key={i} href={l.content} target="_blank" rel="noreferrer" title={l.title} style={{ padding: "8px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
