"use client";

import { useState } from "react";
import DownArrow from "../../../public/images/Chevron.svg";
import UpArrow from "../../../public/images/Chevron2.svg";
import Image from "next/image";

const Activites = ({data}:any) => {
  const {title, sections} = data;

  const [openSections, setOpenSections] = useState<string[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };



  return (
    <div className="mb-20">
      <h2 className="text-2xl md:text-3xl font-semibold mb-5 text-[#003333]">
        {title}
      </h2>

      {sections?.map((section :any) => (
          <div key={section?.title} className="rounded-lg overflow-hidden mb-3">
            <div
              className="flex justify-between items-center bg-gray-100 p-3 cursor-pointer"
              onClick={() => toggleSection(section?.title)}
            >
              <h2 className="font-normal text-[#0e2455] ml-4 text-xl">{section?.title}</h2>
              <Image
                src={openSections?.includes(section?.title) ? UpArrow : DownArrow}
                height={36}
                width={36}
                alt="arrow"
              />
            </div>

            {openSections?.includes(section?.title) && (
              <div className="p-4 bg-white border border-gray-300 bg-[#F6F6F6] mt-3 py-8 px-12">
                <ul className="list-disc list-outside text-[#0e2455] ">
                  {section?.descriptions?.map((point:any, index:any) => (
                    <li key={index} className="text-justify mb-2 text-[#003333] ">{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

    </div>
  );
};

export default Activites;
