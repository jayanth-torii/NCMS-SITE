"use client";

import { useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
 
import PdfModal from "../PdfModal";

const Progression = ({data}:any) => {
  if (!data) return null;  
  const { title, sections } = data;
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const openPdf = (pdf: string) => {
    setSelectedPdf(pdf);
  };

  const closePdf = () => {
    setSelectedPdf(null);
  };

   console.log(data)

  return (
    <div className="mb-10 md:mb-20">
      <h2 className="text-3xl font-semibold mb-6 text-[#003333]">{title}</h2>

      {/* Policy & Composition Sections */}
      <div className="space-y-4">
        {sections?.length > 0 ? (
          sections?.map((section:any) => (
            <div
              key={section.title}
              className="flex justify-between items-center bg-[#F6F6F6] px-3 py-2 duration-200"
            >
              <span className="text-[#0e2455] font-medium text-lg">{section?.title}</span>
              <button
                className="flex items-center cursor-pointer border px-5 py-2 text-[#0e2455] hover:bg-[#0E2455] hover:text-[white] transition"
                onClick={() => openPdf(section?.pdf)}
              >
                View <AiOutlineArrowRight className="ml-2" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-[#0E2455]text-lg text-center">No links available.</p>
        )}
      </div>

      {/* PDF Modal Popup */}
      <PdfModal pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
    </div>
  );
};

export default Progression;
