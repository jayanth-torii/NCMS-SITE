"use client";

import React, { useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import PdfModal from "../../PdfModal";

interface ActivityData {
  id: number;
  title: string;
  pdf: string;
}

interface ActivitiesSectionProps {
  data: {
    title: string;
    Sections: ActivityData[];
  };
}

const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ data }) => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const openPdf = (pdf: string) => {
    setSelectedPdf(pdf);
  };

  const closePdf = () => {
    setSelectedPdf(null);
  };

  return (
    <div className="mb-10 md:mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[#0E2455] mb-4">
        {data.title}
      </h2>

      <div className="bg-white space-y-5">
        {data.Sections.map((activity, index) => (
          <div
            key={activity.id || index}
            className="flex justify-between items-center p-2 border border-[#9E9E9E]"
          >
            <span className="text-[#0E2455] font-medium text-lg ml-2">
              {activity.title}
            </span>
            <button
              className="flex cursor-pointer items-center border px-4 py-1 text-[#0E2455] hover:bg-[#0E2455] hover:text-white transition"
              onClick={() => openPdf(activity.pdf)}
            >
              View <AiOutlineArrowRight className="ml-2" />
            </button>
          </div>
        ))}
      </div>

      {/* PDF Modal Popup */}
      {selectedPdf && <PdfModal pdfUrl={selectedPdf} onClose={closePdf} />}
    </div>
  );
};

export default ActivitiesSection;
