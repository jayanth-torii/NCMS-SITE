"use client";

import React, { useState } from "react";
import Image from "next/image";
import DownArrow from "../../../../../public/images/Chevron.svg";
import UpArrow from "../../../../../public/images/Chevron2.svg";

// Interfaces
interface VisionMissionPoint {
  title?: string;
  description?: string | null;
  ListPoints?: string[]; // Match backend structure
}

interface AccordionItem {
  title: string;
  points: string[];
}

interface AboutSection {
  title?: string;
  descriptions?: string[];
}

interface VisionMissionSection {
  title?: string;
  VMSections?: VisionMissionPoint[];
}

interface AboutAntiRaggingPolicyData {
  AboutSection?: AboutSection;
  VisionMission?: VisionMissionSection;
  AccordionSections?: AccordionItem[];
}

export default function AboutAntiRaggingPolicy({ data }: { data: AboutAntiRaggingPolicyData | null }) {
  if (!data) return null;

  const about = data.AboutSection;
  const visionMission = data.VisionMission;
  const accordions = data.AccordionSections ?? [];

  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const VISION_MISSION_INDEX = -1;

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="bg-white mb-20">
      {/* About Section */}
      {about && (
        <div className="bg-[#F6F6F6] p-6 sm:p-8 rounded-md mb-3">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#003333]">
            {about.title}
          </h1>
          {about.descriptions?.map((desc, idx) => (
            <p key={idx} className="text-justify text-[#003333] leading-relaxed mb-4">
              {desc}
            </p>
          ))}
        </div>
      )}

      {/* Vision & Mission Accordion */}
      {visionMission && Array.isArray(visionMission.VMSections) && visionMission.VMSections.length > 0 && (
        <div className="mb-3">
          <div
            className="flex justify-between bg-[#F6F6F6] items-center cursor-pointer p-4 rounded-md"
            onClick={() => toggleAccordion(VISION_MISSION_INDEX)}
          >
            <span className="text-[#0e2455] font-medium text-xl">
              {visionMission.title ?? "Our Vision & Mission"}
            </span>
            <Image
              src={openAccordion === VISION_MISSION_INDEX ? UpArrow : DownArrow}
              height={32}
              width={32}
              alt="toggle"
            />
          </div>

          {openAccordion === VISION_MISSION_INDEX && (
            <div className="px-6 py-4 bg-[#F6F6F6] mt-2 rounded-md space-y-6">
              {visionMission.VMSections.map((sec, idx) => {
                const hasContent =
                  (sec.description && sec.description.trim() !== "") ||
                  (sec.ListPoints && sec.ListPoints.length > 0);

                if (!hasContent) return null;

                return (
                  <div key={idx}>
                    {sec.title && (
                      <h3 className="text-lg font-semibold text-[#003333] mb-1">
                        {sec.title}
                      </h3>
                    )}
                    {sec.description && (
                      <p className="text-[#003333] mb-2 text-justify">
                        {sec.description}
                      </p>
                    )}
                    {sec.ListPoints && sec.ListPoints.length > 0 && (
                      <ul className="list-disc ml-6 space-y-2">
                        {sec.ListPoints.map((pt, i) => (
                          <li key={i} className="text-[#003333] text-justify">
                            {pt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* General Accordion Sections */}
      {accordions.length > 0 && (
        <div className="space-y-3">
          {accordions.map((acc, index) => (
            <div key={index}>
              <div
                className="flex justify-between bg-[#F6F6F6] items-center cursor-pointer p-4 rounded-md"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-[#0e2455] font-medium text-xl">{acc.title}</span>
                <Image
                  src={openAccordion === index ? UpArrow : DownArrow}
                  height={32}
                  width={32}
                  alt="arrow"
                />
              </div>
              {openAccordion === index && acc.points?.length > 0 && (
                <div className="px-6 py-4 bg-[#F6F6F6] mt-2 rounded-md">
                  <ul className="list-disc ml-6 space-y-2">
                    {acc.points.map((point, idx) => (
                      <li key={idx} className="text-[#003333] text-justify">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
