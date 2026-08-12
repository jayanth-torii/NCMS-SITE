"use client";

import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type ConferenceProgram = {
  id: number;
  Program_title: string;
  descriptions: string[];
  images: string[];
};

const ConferenceProps = ({ programs }: { programs: ConferenceProgram[] }) => {
  return (
    <div className="w-full space-y-10 mt-10">
      {programs?.map((conference) => (
        <ConferenceSection key={conference?.id} conference={conference} />
      ))}
    </div>
  );
};

const ConferenceSection = ({ conference }: { conference: ConferenceProgram }) => {
  const [index, setIndex] = useState(0);
  const imagesPerSlide = 3;
  const totalImages = conference?.images?.length;

  const nextSlide = () => {
    setIndex((prev) => (prev + imagesPerSlide) % totalImages);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - imagesPerSlide + totalImages) % totalImages);
  };

  return (
    <div className="w-full rounded-lg bg-white px-4">
      <h2 className="text-2xl md:text-3xl font-semibold mb-5 text-[#003333]">
        {conference?.Program_title}
      </h2>
      {conference?.descriptions?.map((desc, i) => (
        <p key={i} className="text-justify text-[#0E2455] mb-2">
          {desc}
        </p>
      ))}

      {totalImages > 0 && (
        <div className="relative flex items-center justify-center overflow-hidden mt-6">
          <button
            onClick={prevSlide}
            className="cursor-pointer absolute left-0 md:left-4 p-2 bg-[#0E2455] text-white border border-black rounded-full hover:bg-gray-200 transition duration-300 z-10"
          >
            <FaArrowLeft />
          </button>

          <div className="flex gap-4 w-full justify-center">
            {conference?.images?.slice(index, index + imagesPerSlide)?.map((image, idx) => (
              <img
                key={idx}
                src={image || ""}
                alt={`Program image ${idx + 1}`}
                className="w-full h-64 object-cover rounded-md shadow-md"
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="cursor-pointer absolute right-0 md:right-4 p-2 bg-[#0E2455] text-white border border-black rounded-full hover:bg-gray-200 transition duration-300 z-10"
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ConferenceProps;
