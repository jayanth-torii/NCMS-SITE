"use client";

import { useState } from "react";
import Image from "next/image";
import PdfModal from "@/components/PdfModal";

const AntiRaggingCell = ({ data }: { data: any }) => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  if (!data) return null;

  const openPdf = () => {
    setSelectedPdf(data.pdf);
  };

  const closePdf = () => {
    setSelectedPdf(null);
  };

  return (
    <section className="w-full flex flex-col md:flex-row md:justify-between border border-gray-400 shadow-lg rounded-lg overflow-hidden mb-20 py-3 px-5">
      {/* Left Container (Text & Button) */}
      <div className="w-full md:w-1/3 flex flex-col justify-center p-6 bg-white">
        <h2 className="text-[#F6872A] text-2xl md:text-3xl mb-3">
          {data.title}
        </h2>
        <p className="text-[#0e2455] text-base mb-4">{data.description}</p>
        <button
          className="text-white bg-[#0E2455] cursor-pointer px-5 py-2 rounded-sm mt-2"
          onClick={openPdf}
        >
          {data.buttonText || "View PDF"}
        </button>
      </div>

      {/* Right Container (Image) */}
      <div className="w-full md:w-1/2 flex justify-center order-first md:order-none">
        {data.image && (
          <Image
            src={data.image}
            alt="Anti Ragging Cell"
            width={500}
            height={300}
            className="w-full h-auto object-contain"
          />
        )}
      </div>

      {/* PDF Modal Popup */}
      <PdfModal pdfUrl={selectedPdf} onClose={closePdf} />
    </section>
  );
};

export default AntiRaggingCell;
