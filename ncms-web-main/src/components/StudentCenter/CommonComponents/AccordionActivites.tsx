import { useState } from "react";
import Image from "next/image";
import ChevronDown from "../../../../public/images/Chevron.svg";
import ChevronUp from "../../../../public/images/Chevron2.svg";

interface AccordionActivitesSection {
  id: number;
  title: string;
  description: string;
  images: string[];
}

interface AccordionActivitesProps {
  data: {
    title: string;
    Sections: AccordionActivitesSection[];
  };
}

export default function AccordionActivites({ data }: AccordionActivitesProps) {
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
                    <div className="gap-6 mt-4 rounded-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                      {activity.images.map((src, imgIndex) => (
                        <div key={imgIndex} className="relative w-full aspect-[4/3] overflow-hidden rounded-md"> 
                        <Image
                          src={src}
                          alt={`Activity ${index + 1} Image ${imgIndex + 1}`}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          priority={imgIndex < 3}
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
