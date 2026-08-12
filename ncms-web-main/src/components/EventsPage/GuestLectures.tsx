"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import down from "../../../public/images/Chevron.svg";
import eventStatic from "@/data-export/event/data.json";
import { getEvents } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

type AccordionItem = {
  id: number;
  title: string;
  descriptions: string[];
  images: string[];
};

type GuestLecturesData = {
  id: number;
  title: string;
  accordionItem: AccordionItem[];
};

export default function GuestLectures() {
  const { data: event } = useLiveData(getEvents, eventStatic as any);
  const [openIndices, setOpenIndices] = useState<number[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const guestLecturesData = (event as any)?.guestLecturesData as GuestLecturesData | null;

  const toggleAccordion = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const nextImage = (imagesLength: number) => {
    setCurrentImageIndex((prev) =>
      prev < imagesLength - 3 ? prev + 1 : prev
    );
  };

  if (!guestLecturesData) {
    return <div className="text-center py-10 text-red-500">No Guest Lectures Data Found</div>;
  }

  return (
    <div className="mb-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#003333]">
        {guestLecturesData?.title}
      </h2>

      <div className="mt-8 space-y-4">
        {guestLecturesData?.accordionItem?.map((item, index) => {
          const isOpen = openIndices?.includes(index);

          return (
            <div key={item?.id} className="border border-gray-300">
              <div
                className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-lg text-[#0E2455]">{item?.title}</span>
                <Image
                  src={down}
                  alt="Toggle"
                  width={20}
                  height={20}
                  className={`transform transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {isOpen && (
                <div className="p-4 text-gray-600">
                  {item?.descriptions?.map((desc, i) => (
                    <p key={i} className="text-justify text-[#0E2455] mb-2">
                      {desc}
                    </p>
                  ))}

                  {item?.images && item?.images?.length > 0 && (
                    <div className="relative flex items-center overflow-hidden w-full mt-4">
                      <button
                        onClick={prevImage}
                        className="cursor-pointer absolute left-2 p-2 bg-[#0E2455] border border-black rounded-full hover:bg-gray-200 transition duration-300"
                      >
                        <FaArrowLeft className="text-white" size={24} />
                      </button>

                      <div className="flex gap-4 w-full justify-center">
                        {/* Mobile View */}
                        <div className="block sm:hidden w-full">
                          <div className="flex flex-col justify-center items-center">
                            <Image
                              src={item?.images[currentImageIndex]}
                              alt={`Guest Lecture ${currentImageIndex + 1}`}
                              width={300}
                              height={200}
                              className="w-full h-64 object-cover rounded-md shadow-md"
                            />
                          </div>
                        </div>

                        {/* Desktop View */}
                        <div className="hidden sm:flex gap-4 w-full justify-center">
                          {item?.images
                            ?.slice(currentImageIndex, currentImageIndex + 3)
                            ?.map((img :any, imgIndex) => (
                              <div
                                key={imgIndex}
                                className="flex flex-col justify-center items-center w-1/3"
                              >
                                <Image
                                  src={img || ""}
                                  alt={`Lecture Image ${imgIndex + 1}`}
                                  width={300}
                                  height={200}
                                  className="w-full h-64 object-cover rounded-md shadow-md"
                                />
                              </div>
                            ))}
                        </div>
                      </div>

                      <button
                        onClick={() => nextImage(item?.images?.length)}
                        className="cursor-pointer absolute right-2 p-2 bg-[#0E2455] border border-black rounded-full hover:bg-gray-200 transition duration-300"
                      >
                        <FaArrowRight className="text-white" size={24} />
                      </button>
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
