"use client";
import React from "react";
// import NPTELChapterContent from "@/app/Data/NPTELChapterContent";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import PdfModal from "@/components/PdfModal";

export default function Establishment() {
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
    const openPdf = (pdf: string) => setSelectedPdf(pdf);
    const closePdf = () => setSelectedPdf(null);
    return (
        <div className="mb-10 md:mb-20">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                <div className="space-y-4 bg-[#F6F6F6] p-6 h-64 md:h-80 flex flex-col justify-center items-start">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#003333]">{NPTELChapterContent.Establishment.title}</h2>
                    <button className="px-6 cursor-pointer py-3 border border-[#000000] text-[#141629] font-semibold" onClick={()=>openPdf(NPTELChapterContent.Establishment.pdf)}>
                        {NPTELChapterContent.Establishment.buttonText}
                    </button>
                </div>
                <div className="relative w-full h-64 md:h-80 border border-[#000000]">
                    <Image
                        src={NPTELChapterContent.Establishment.imageUrl}
                        alt="Newsletter Event"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            </div>


            <PdfModal pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} /> 
            */}
        </div>
    );
}
