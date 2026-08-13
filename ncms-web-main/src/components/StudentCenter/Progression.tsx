"use client";

import { useState } from "react";
import PdfModal from "../PdfModal";

const PROG_ICONS = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
];

const Progression = ({ data }: any) => {
  if (!data) return null;
  const { title, sections } = data;
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const openPdf = (pdf: string) => setSelectedPdf(pdf);
  const closePdf = () => setSelectedPdf(null);

  return (
    <div>
      <div className="sc-hub__head" style={{ marginBottom: "22px" }}>
        <div>
          <span className="sc-eyebrow">Journey</span>
          <h2 className="sc-title">{title || "Student Progression"}</h2>
          <p className="sc-lead" style={{ margin: "10px 0 0", maxWidth: "none", textAlign: "left" }}>
            Documents that map the academic and professional growth of our students.
          </p>
        </div>
      </div>

      <div className="sc-prog-grid-cards">
        {sections?.length > 0 ? (
          sections.map((section: any, index: number) => (
            <button key={section.title} type="button" className="sc-prog-card" onClick={() => openPdf(section?.pdf)}>
              <span className="sc-prog-card__icon">{PROG_ICONS[index % PROG_ICONS.length]}</span>
              <h3 className="sc-prog-card__title">{section?.title}</h3>
              <p className="sc-prog-card__sub">Student Progression · PDF</p>
              <span className="sc-prog-card__view">
                View Document
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

export default Progression;
