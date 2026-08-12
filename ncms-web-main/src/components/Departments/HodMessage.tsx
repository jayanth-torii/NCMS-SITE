"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import hodContentsData from "@/data-export/hod-contents/data.json";
import { getHodContents } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

interface HodMessageProps {
  programme?: string;
  onHodContentCheck?: (hasContent: boolean) => void;
}

const HodMessage = ({ programme: programmeProp, onHodContentCheck }: HodMessageProps) => {
  const searchParams = useSearchParams();
  const programme = programmeProp ?? searchParams.get("programme") ?? "";
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: hodContent } = useLiveData(getHodContents, hodContentsData as any);

  // Normalize programme name
  const normalizedProgramme = programme.toLowerCase().replace(/&/g, "and").trim();

  // Map department key to API key
  const contentMapping: Record<string, string> = {
    "science": "Science",
    "commerce and management": "UG_Commerce",
    "computer application": "UG_CA",
    "masters in business administration": "MBA",
    "masters of commerce": "MOC",
    "masters of computer application": "MCA",
  };

  const departmentKey = contentMapping[normalizedProgramme];

  // Notify the parent tab bar whether HOD content exists (in an effect, not during render)
  useEffect(() => {
    onHodContentCheck?.(!!departmentKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentKey, hodContent]);

  if (!hodContent) {
    return <p style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Loading Data...</p>;
  }

  const content = hodContent[departmentKey];

  if (!content) {
    return (
      <div className="dept-tab-pane pane-hod">
        <div className="empty-message-box">
          HOD's Message not found for <strong>{programme}</strong>.
        </div>
      </div>
    );
  }

  const messages = Array.isArray(content.hodMessage)
    ? content.hodMessage
    : [content.hodMessage];
  const visibleMessages = isExpanded ? messages : messages.slice(0, 1);

  return (
    <div className="dept-tab-pane pane-hod">
      <div className="premium-academic-layout" style={{ padding: 0 }}>
        <div
          className="premium-card hod-unified-card"
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "3rem", padding: "4rem 3rem" }}
        >
          {/* HOD PROFILE CARD (Left Side) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: "1 1 250px" }}>
            <div style={{ width: "220px", height: "220px", borderRadius: "50%", overflow: "hidden", border: "5px solid #f1f5f9", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", marginBottom: "1.5rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={content.hodImage} alt={content.hodName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0e2455", margin: "0 0 0.5rem 0" }}>{content.hodName}</h2>
            <p style={{ fontSize: "1.2rem", color: "#F6872A", fontWeight: 600, margin: "0 0 1rem 0" }}>{content.hodDesignation}</p>
          </div>

          {/* HOD MESSAGE (Right Side) */}
          <div style={{ flex: "3 1 400px", position: "relative", padding: "2rem", backgroundColor: "#f8fafc", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ position: "absolute", top: "1rem", left: "1rem", color: "rgba(14, 36, 85, 0.05)" }}
            >
              <path d="M10.99 4.75c-2.46.23-5.26 1.77-6.52 4.13-1.02 1.9-.92 4.38.1 6.3 1.25 2.37 4.14 3.73 6.64 2.87 2.1-.73 3.32-3.13 2.5-5.32-.47-1.25-1.55-2.22-2.8-2.61a5.61 5.61 0 0 0-3.32.07c.07-.63.26-1.21.6-1.74a4.13 4.13 0 0 1 3.52-1.92c.3-.02.58-.29.58-.6v-1.12c0-.04-.01-.08-.02-.12a.66.66 0 0 0-.28-.31Z"></path>
              <path d="M22.99 4.75c-2.46.23-5.26 1.77-6.52 4.13-1.02 1.9-.92 4.38.1 6.3 1.25 2.37 4.14 3.73 6.64 2.87 2.1-.73 3.32-3.13 2.5-5.32-.47-1.25-1.55-2.22-2.8-2.61a5.61 5.61 0 0 0-3.32.07c.07-.63.26-1.21.6-1.74a4.13 4.13 0 0 1 3.52-1.92c.3-.02.58-.29.58-.6v-1.12c0-.04-.01-.08-.02-.12a.66.66 0 0 0-.28-.31Z"></path>
            </svg>
            <h2 style={{ fontSize: "1.6rem", margin: "0 0 1rem 0", color: "#0e2455", fontWeight: 800, position: "relative", zIndex: 1 }}>
              {content.title || "HOD's Message"}
            </h2>
            {visibleMessages.map((msg: string, index: number) => (
              <p
                key={index}
                style={{ fontStyle: "italic", fontSize: "1.15rem", color: "#334155", position: "relative", zIndex: 1, lineHeight: 1.8, margin: "0 0 1rem 0" }}
              >
                "{msg}"
              </p>
            ))}
            {messages.length > 1 && (
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
      </div>
    </div>
  );
};

export default HodMessage;
