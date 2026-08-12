"use client";

import React, { useState } from "react";
import Image from "next/image";
import PdfModal from "@/components/PdfModal";

interface PolicyAndCompositionProps {
  data: {
    title: string;
    description: string;
    DocumentTitle1: string;
    DocumentTitle2: string;
    Document1: string;
    Document2: string;
    image: string;
  };
}

export default function PolicyAndComposition({ data }: { data: PolicyAndCompositionProps["data"] }) {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const openPdf = (pdf: string) => setSelectedPdf(pdf);
  const closePdf = () => setSelectedPdf(null);

  if (!data) return null;

  return (
    <div>
      <div className="items-center gap-6 flex flex-col md:flex-row mb-10 md:mb-16">
        {/* Text Section */}
        <div className="space-y-4 bg-[#F6F6F6] p-6 h-74 md:h-80 w-full md:w-[40%]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003333]">{data?.title || "Default Title"}</h2>
          <p className=" text-[#0E2455] mb-5">{data?.description || "Default Description"}</p>

          {/* Conditionally Render Buttons */}
          <div className="flex flex-col space-y-6 w-full sm:w-1/2 md:w-4/5 lg:w-3/5 whitespace-nowrap">
            {data?.DocumentTitle1 && data?.Document1 && (
              <button
                className="cursor-pointer px-5 py-2 text-[#0E2455] border border-[#000000] font-semibold"
                onClick={() => openPdf(data.Document1)}
              >
                {data.DocumentTitle1}
              </button>
            )}
            {data?.DocumentTitle2 && data?.Document2 && (
              <button
                className="cursor-pointer px-5 py-2 bg-[#0E2455] text-white font-semibold"
                onClick={() => openPdf(data.Document2)}
              >
                {data.DocumentTitle2}
              </button>
            )}
          </div>
        </div>
        
        {/* Image Section */}
        <div className="relative h-64 md:h-80 w-full md:w-[60%]">
          {data?.image ? (
            <Image src={data.image} alt="Policy Image" fill objectFit="cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
              No Image Available
            </div>
          )}
        </div>


 
      </div>

      <PdfModal pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
    </div>
  );
}
