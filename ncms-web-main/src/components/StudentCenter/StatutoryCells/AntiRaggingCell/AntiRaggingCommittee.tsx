"use client";

import React, { useState } from "react";
import Image from "next/image";
import PdfModal from "@/components/PdfModal";

interface AntiRaggingCommitteeProps {
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

export default function AntiRaggingCommittee({ data }: { data: AntiRaggingCommitteeProps["data"] }) {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const openPdf = (pdf: string) => setSelectedPdf(pdf);
  const closePdf = () => setSelectedPdf(null);

  if (!data) return null;

    return (
        <div>
            <div className="items-center gap-6 mb-20 flex flex-col md:flex-row">
                {/* Text Section */}
                <div className="space-y-4 bg-[#F6F6F6] p-6 h-74 md:h-80 w-full md:w-1/3">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#003333]">{data.title}</h2>
                    <button className="px-3 py-2 bg-[white] cursor-pointer border border-[#0E2455] text-[#0E2455] font-semibold" onClick={()=>openPdf(data?.Document1)}>
                        {data?.DocumentTitle1}
                    </button>
                    <br/>
                    <button className="px-3 py-2 bg-[#0E2455] cursor-pointer text-white font-semibold" onClick={()=>openPdf(data?.Document2)}>
                        {data?.DocumentTitle2}
                    </button>
                </div>

                {/* Image Section */}
                <div className="relative w-full h-64 md:h-80 w-full md:w-2/3">
                    <Image
                        src={data?.image}
                        alt="AntiRagging Committee"
                        layout="fill"
                        objectFit="fill"
                    />
                </div>
            </div>
            
            {/* PDF MODAL */}
            <PdfModal pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
        </div>
    );
}
