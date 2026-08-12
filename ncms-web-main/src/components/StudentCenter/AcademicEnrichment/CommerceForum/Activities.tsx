"use client";

import { useState } from "react";
import Image from "next/image";
import ChevronDown from "../../../../../public/images/Chevron.svg";
import ChevronUp from "../../../../../public/images/Chevron2.svg";

interface ActivitySection {
  id: number;
  title: string;
  description: string;
  images: string[];
}

interface ActivitiesProps {
  data: {
    title: string;
    Sections: ActivitySection[];
  };
}

export default function Activities({ data }: ActivitiesProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="mb-10 md:mb-20">
      <h2 className="text-2xl md:text-3xl font-bold text-[#003333] mb-6">{data.title}</h2>
      <div className="space-y-2">
        {data.Sections.map((activity, index) => {
          const isOpen = openIndices.includes(index);
          return (
            <div key={activity.id} className="rounded-md">
              <button
                onClick={() => toggleAccordion(index)}
                className="flex justify-between items-center cursor-pointer w-full p-3 bg-[#F6F6F6] transition mb-3"
              >
                <span className="text-[#0E2455] text-lg text-left">{activity.title}</span>
                <Image
                  src={isOpen ? ChevronUp : ChevronDown}
                  height={36}
                  width={36}
                  alt="toggle"
                />
              </button>

              {isOpen && (
                <div className="p-4 bg-white border border-[#616161] rounded-md">
                  <p className="text-[#0E2455] text-justify whitespace-pre-line">
                    {activity.description}
                  </p>
                  {activity.images?.length > 0 && (
                    <div className="flex gap-6 mt-4 flex-wrap rounded-md">
                      {activity.images.map((src, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="w-72 aspect-[4/3] relative rounded-md overflow-hidden"
                        >
                          <img
                            src={src}
                            alt={`Activity ${index + 1} Image ${imgIndex + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
