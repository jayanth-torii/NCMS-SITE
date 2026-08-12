"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import PdfModal from "../PdfModal";
 
export default function UniversityManual({data}:any) {
    if (!data) return null;
    const UniversityManualData = data;

    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
    const openPdf = (pdf: string) => setSelectedPdf(pdf);
    const closePdf = () => setSelectedPdf(null);
    return (
        <div>
            <div className="items-center gap-6 mb-20 flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative h-64 md:h-80 w-full md:w-[55%] ">
                    <Image
                        src={UniversityManualData?.image}
                        alt="UNIVERSITY MANUAL"
                        layout="fill"
                        objectFit="fill"
                    />
                </div>

                {/* Text Section */}
                <div className="space-y-4 bg-[#F6F6F6] p-8 h-74 md:h-80 w-full md:w-[45%]">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#003333]">{UniversityManualData?.title}</h2>
                    <p className="text-justify text-gray-700 mb-5">{UniversityManualData?.description}</p>
                    <button className="px-6 py-3 bg-[white] cursor-pointer border border-[#0E2455] text-[#0E2455] font-semibold" onClick={()=>openPdf(UniversityManualData?.pdf)}>
                        {UniversityManualData?.buttonText}
                    </button>
                    <br/>
                     
                </div>
            </div>

            {/* PDF Modal Popup  */}
            <PdfModal pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
        </div>
    );
}
