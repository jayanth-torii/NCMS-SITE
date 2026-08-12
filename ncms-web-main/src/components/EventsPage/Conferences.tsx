"use client";

import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ConferenceProps from "./ConferenceProps";
import eventStatic from "@/data-export/event/data.json";
import { getEvents } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const Conferences = () => {
  const { data: event } = useLiveData(getEvents, eventStatic as any);
  const conferenceData: any = (event as any)?.conferenceSection;
  const [activeTab, setActiveTab] = useState<string>(
    conferenceData?.National_Conference?.Sections?.[0]?.TabName ?? ""
  );
  const [index, setIndex] = useState(0);

  const imagesPerSlide = 3;

  useEffect(() => {
    setIndex(0);
  }, [activeTab]);

  if (!conferenceData) {
    return <div className="text-center py-20 text-gray-500 text-lg">Loading...</div>;
  }

  const sections = conferenceData?.National_Conference?.Sections || [];
  const currentSection = sections.find((s: any) => s?.TabName === activeTab);
  const currentImages = currentSection?.images || [];

  const nextSlide = () => {
    setIndex((prev) => (prev + imagesPerSlide) % currentImages?.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - imagesPerSlide + currentImages?.length) % currentImages?.length);
  };

  return (
    <div className="w-full rounded-lg bg-white mb-20 px-4">
      <h2 className="text-2xl font-bold text-[#003333] mb-4">{conferenceData?.title}</h2>
      {/* Description */}
      {conferenceData?.description?.map((desc: string, i: number) => (
        <p key={i} className="text-justify text-[#0E2455] mb-3">{desc}</p>
      ))}

      {/* National Conference Tabs */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-5 text-[#003333]">
          {conferenceData?.National_Conference?.title}
        </h2>
        <div className="flex flex-col items-start md:flex-row md:space-x-4 border-b-2 border-gray-200 mb-8">
          {sections?.map((tab: any) => (
            <button
              key={tab?.TabName}
              className={`pb-2 cursor-pointer !text-lg md:!text-xl text-[#003333] !font-semibold font-medium ${
                activeTab === tab?.TabName ? " !border-b-8 !border-[#F09300]" : ""
              }`}
              onClick={() => {
                setActiveTab(tab?.TabName);
                setIndex(0);
              }}
            >
              {tab?.TabName}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {currentSection && (
          <div className="border-[1px] border-gray-400 rounded-lg pt-8 pb-2 p-2">
            <p className="text-justify text-[#003333] mb-4 p-5">{currentSection?.description}</p>

            {currentImages?.length > 0 && (
              <div className="hidden sm:flex items-center space-x-4 overflow-hidden relative">
                <button onClick={prevSlide} className="cursor-pointer absolute left-4 p-2 bg-[#0E2455] text-white border border-black rounded-full hover:bg-gray-200 transition duration-300">
                  <FaArrowLeft />
                </button>
                <div className="flex gap-4 w-full justify-center">
                  {currentImages?.slice(index, index + imagesPerSlide)?.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Slide ${idx}`}
                      className="w-full h-64 object-cover rounded-md shadow-md"
                    />
                  ))}
                </div>
                <button onClick={nextSlide} className="cursor-pointer absolute right-0 p-2 bg-[#0E2455] text-white border border-black rounded-full hover:bg-gray-200 transition duration-300">
                  <FaArrowRight />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* YouTube Video */}
      <div className="w-full aspect-video mb-4">
        <iframe
          className="w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${conferenceData?.UTube_Link}`}
          title="YouTube Video Player"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>

      {/* Program Sections */}
      <ConferenceProps programs={conferenceData?.Programs_Sections} />
    </div>
  );
};

export default Conferences;
