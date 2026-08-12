"use client";

import { useState } from "react";
import Image from "next/image";
import PdfModal from "../PdfModal";

const StudentManual = ({data}:any) => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  
  const publicationData = data;

  const openPdf = () => {
    setSelectedPdf(publicationData?.pdf);
  };

  const closePdf = () => {
    setSelectedPdf(null);
  };

  return (
    <section className="researchscheme w-full flex flex-col md:flex-row md:justify-between border border-gray-400 shadow-lg rounded-lg overflow-hidden mb-20 py-3 px-5">
      {/* Left Container (Text & Button) */}
      <div className="w-full md:w-1/3 flex flex-col justify-center p-6 bg-white">
        <h2 className="text-[#F6872A] text-2xl md:text-3xl mb-3">
          {publicationData?.title}
        </h2>
        <button
          className="text-white bg-[#0E2455] cursor-pointer px-6 py-2 rounded-sm mt-2"
          onClick={openPdf}
        >
          {publicationData?.buttonText}
        </button>
      </div>

      {/* Right Container (Image) */}
      <div className="w-full md:w-1/2 flex justify-center order-first md:order-none">
        <Image
          src={publicationData?.image}
          alt="Student Manual"
          width={500}
          height={100}
          className="w-full h-full object-cover"
        />
      </div>

      {/* PDF Modal Popup  */}
      <PdfModal pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
    </section>
  );
};

export default StudentManual;
