"use client";

import React, { useState } from "react";
import Image from "next/image";
import DownArrow from "../../../public/images/Chevron.svg";
import UpArrow from "../../../public/images/Chevron2.svg";

export default function AboutPlacements({ data }: { data: any }) {
  const sectionData = data?.[0];
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="bg-white mb-10 md:mb-20">
      {/* About Section */}
      <div className="bg-[#F6F6F6] p-6 sm:p-8 rounded-md mb-3">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#003333]">
          {sectionData?.about?.title || "About Placements"}
        </h1>
        {sectionData?.about?.descriptions?.map((paragraph: string, index: number) => (
          <p key={index} className="text-justify text-[#003333] leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Accordion Sections */}
      <div className="space-y-3">
        {/* Vision & Mission Accordion */}
        <div>
          <div
            className="flex justify-between bg-[#F6F6F6] items-center cursor-pointer p-3"
            onClick={() => toggleAccordion(0)}
          >
            <span className="text-[#0e2455] pl-3 font-medium text-xl">{sectionData?.visionMission?.title}</span>
            <Image src={openSections.includes(0) ? UpArrow : DownArrow} height={36} width={36} alt="arrow" />
          </div>
          {openSections.includes(0) && (
            <div className="px-8 py-3 bg-[#F6F6F6] mt-3 space-y-5">
              {sectionData?.visionMission?.sections?.map((section: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-xl font-semibold text-[#0E2455] mb-2">{section?.title}</h3>
                  <p className="text-[#003333] mb-2">{section?.description}</p>
                  <ul className="list-disc ml-6 text-[#003333] space-y-1">
                    {section?.points?.map((pt: string, i: number) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Other Accordion Items (OBJ, Fun, etc.) */}
        {sectionData?.accordion?.map((section: any, index: number) => {
          const accordionIndex = index + 1; // to avoid conflict with Vision & Mission at index 0
          const isOpen = openSections.includes(accordionIndex);

          return (
            <div key={accordionIndex}>
              <div
                className="flex justify-between bg-[#F6F6F6] items-center cursor-pointer p-3"
                onClick={() => toggleAccordion(accordionIndex)}
              >
                <span className="text-[#0e2455] pl-3 font-medium text-xl">{section?.title}</span>
                <Image src={isOpen ? UpArrow : DownArrow} height={36} width={36} alt="arrow" />
              </div>
              {isOpen && (
                <div className="px-8 py-3 bg-[#F6F6F6] mt-3">
                  <ul className="list-disc ml-6 space-y-1">
                    {section?.points?.map((item: string, j: number) => (
                      <li key={j} className="text-justify text-[#003333]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
