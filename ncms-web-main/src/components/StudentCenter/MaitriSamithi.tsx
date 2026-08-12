"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import PdfModal from "../PdfModal";

export default function MaitriSamithi({data}:any) {
    if (!data) return null;  
    const newsletterData = data;
    
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
    const openPdf = (pdf: string) => setSelectedPdf(pdf);
    const closePdf = () => setSelectedPdf(null);
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6 mb-20">
                <div className="space-y-4 bg-[#F6F6F6] p-6  ">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#003333]">{newsletterData?.title}</h2>
                    <p className="text-justify text-[#0E2455] mb-5">{newsletterData?.description}</p>
                    <button className="px-6 cursor-pointer py-3 bg-[#0E2455] text-white font-semibold" onClick={()=>openPdf(newsletterData?.pdf)}>
                        {newsletterData?.buttonText}
                    </button>
                </div>
                <div className="relative w-full h-64 md:h-80">
                    <Image
                        src={newsletterData?.image}
                        alt="Newsletter Event"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>

            {/* PDF MODAL */}
            <PdfModal pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
        </div>
    );
}