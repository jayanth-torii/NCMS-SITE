"use client";
import React, { useState } from "react";
import PdfModal from "../PdfModal";

export default function MaitriSamithi({ data }: any) {
  if (!data) return null;
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const openPdf = (pdf: string) => setSelectedPdf(pdf);
  const closePdf = () => setSelectedPdf(null);

  const image = data.image || data.imageUrl || "/images/StudentCenter/maitri.png";

  return (
    <div className="sc-maitri">
      <div className="sc-maitri__card">
        <span className="sc-maitri__badge">Parents&apos; Cell</span>
        <h3 className="sc-maitri__title">{data.title || "Maitri Samithi"}</h3>
        <p className="sc-maitri__text">{data.description}</p>
        <button type="button" className="sc-maitri__btn" onClick={() => openPdf(data.pdf)}>
          {data.buttonText || "View Composition"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      <div className="sc-maitri__photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={data.title || "Maitri Samithi"} loading="lazy" />
        <span className="sc-maitri__photo-cap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {data.title || "Maitri Samithi"}
        </span>
      </div>

      <PdfModal pdfUrl={selectedPdf} onClose={closePdf} />
    </div>
  );
}
