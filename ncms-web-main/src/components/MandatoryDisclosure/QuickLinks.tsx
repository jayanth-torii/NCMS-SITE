"use client";

import { useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import PdfModal from "../PdfModal";

type QuickLink = {
  id: number;
  title: string;
  pdf: string;
  image?: string;
};

type QuickLinksProps = {
  data: {
    title: string;
    image?: string;
    links: QuickLink[];
  };
};

const QuickLinks = ({ data }: QuickLinksProps) => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const openPdf = (pdf: string) => {
    setSelectedPdf(pdf);
  };

  const closePdf = () => {
    setSelectedPdf(null);
  };

  return (
    <div className="flex flex-col items-center md:flex-row">

      
      <div className="w-[40%]">
        {data?.image && (
          <img
            src={data.image}
            alt={data.title}
            className="max-h-[750px] w-auto object-contain rounded-md"
          />
        )}
      </div>

      
      <div className="md:w-2/3 border-2 border-gray-300 p-10 space-y-2">

 
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#003333]">
          {data?.title}
        </h2>

    
        <div className="space-y-4">
          {data?.links?.map((link) => (
            <div
              key={link?.id}
              className="flex flex-col sm:flex-row justify-between items-center bg-[#F6F6F6] p-3"
            >
       
              <span className="text-[#0E2455] font-medium text-lg ml-2">
                {link?.title}
              </span>

             
              <button
                className="flex items-center border border-[#000000] cursor-pointer px-5 py-1 bg-[#0E2455] rounded-sm text-[#ffffff] hover:bg-white hover:text-[#0e2455] transition"
                onClick={() => openPdf(link?.pdf)}
              >
                View <AiOutlineArrowRight className="ml-2" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Modal */}
      {selectedPdf && <PdfModal pdfUrl={selectedPdf} onClose={closePdf} />}
    </div>
  );
};

export default QuickLinks;
