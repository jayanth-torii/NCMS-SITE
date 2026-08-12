"use client";

import { useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import PdfModal from "../PdfModal";


const Reports = ({data}:any) => {
  const {title, sections} = data;
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const openPdf = (pdf: string) => {
    setSelectedPdf(pdf);
  };

  const closePdf = () => {
    setSelectedPdf(null);
  };

  return (
    <div className="mb-20">
      <h2 className="text-2xl md:text-3xl font-semibold mb-5 text-[#003333]">{title || ""}</h2>

      <div className="space-y-3">
        {sections?.map((section:any) => (
          <div key={section?.title} className="flex justify-between items-center p-3 rounded-md mb-2 bg-[#F6F6F6]">
            <span className="text-[#0e2455] font-medium text-xl">{section?.title}</span>
            <button
              className="flex items-center border border-[#000000] cursor-pointer px-5 py-1 bg-[#0E2455] rounded-sm text-[#ffffff] hover:bg-[white] hover:text-[#0e2455] transition"
              onClick={() => openPdf(section?.pdf)}
            >
              View <AiOutlineArrowRight className="ml-2" />
            </button>
          </div>
        ))}
      </div>

      {/* PDF Modal Popup  */}
      <PdfModal pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
    </div>
  );
};

export default Reports;
