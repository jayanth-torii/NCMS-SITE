"use client";

import { useState } from "react";
import PdfModal from "../PdfModal";

const Policy = ({ data }: any) => {
  if (!data) return null;
  const { title, sections } = data;
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const openPdf = (pdf: string) => setSelectedPdf(pdf);
  const closePdf = () => setSelectedPdf(null);

  return (
    <div>
      <div className="sc-hub__head" style={{ marginBottom: "22px" }}>
        <div>
          <span className="sc-eyebrow">Guidelines</span>
          <h2 className="sc-title">{title || "Policy & Composition"}</h2>
          <p className="sc-lead" style={{ margin: "10px 0 0", maxWidth: "none", textAlign: "left" }}>
            Official policies and cell compositions for reference.
          </p>
        </div>
      </div>

      <div className="sc-policy">
        {sections?.length > 0 ? (
          sections.map((section: any) => (
            <button key={section.title} type="button" className="sc-policy__card" onClick={() => openPdf(section?.pdf)}>
              <span className="sc-policy__card-pdf">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="13" y2="17" />
                </svg>
              </span>
              <span className="sc-policy__card-txt">
                <span className="sc-policy__card-title">{section?.title}</span>
                <span className="sc-policy__card-sub">{title || "Policy document"} · PDF</span>
              </span>
              <span className="sc-policy__card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </button>
          ))
        ) : (
          <p className="sc-prog-empty">No documents available.</p>
        )}
      </div>

      <PdfModal pdfUrl={selectedPdf} onClose={closePdf} />
    </div>
  );
};

export default Policy;
