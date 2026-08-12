"use client";

import { useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

type Activity = {
  title: string;
  instaGramLink: string;
  faceBookLink: string;
};

type ActivitiesIICProps = {
  data: {
    title: string;
    tabs: string[];
    activitiesData: Record<string, Activity[]>;
  };
};

const ActivitiesIIC = ({ data }: ActivitiesIICProps) => {
  const tabs = data?.tabs || [];
  const activitiesData = data?.activitiesData || {};
  const [activeTab, setActiveTab] = useState<string>(tabs[0] || "");

  return (
    <div className="mb-20">
      <h2 className="text-2xl md:text-3xl font-bold mb-10 text-[#003333]">
        {data?.title}
      </h2>

      {/* Tabs */}
      <div className="md:w-full flex flex-col items-start md:flex-row justify-center md:justify-start md:space-x-8 mb-10 md:mb-8 border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[#003333] cursor-pointer !text-xl text-start leading-[1] !font-semibold pb-2 ${
              activeTab === tab ? "border-b-4 md:border-b-8 border-[#FFB300]" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div
        className="space-y-3 max-h-[500px] overflow-y-auto pr-2"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#F09300 #E2E2E24D" }}
      >
        {activitiesData[activeTab]?.length > 0 ? (
          activitiesData[activeTab].map((section, idx) => (
            <div
              key={`${section.title}-${idx}`}
              className="flex flex-col md:flex-row justify-between items-center border-b border-gray-300 p-3 bg-white"
            >
              <span className="text-[#0e2455] font-medium w-[65%] text-center md:text-left mb-3">
                {section.title}
              </span>
              <a
                href={section.instaGramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-[#0E2455] text-white border border-[#000000] mb-2 px-5 py-1 rounded-sm transition"
              >
                Instagram Link <AiOutlineArrowRight className="ml-2" />
              </a>
              <a
                href={section.faceBookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center border border-[#000000] px-5 py-1 rounded-sm text-[#0e2455] transition"
              >
                Facebook Link <AiOutlineArrowRight className="ml-2" />
              </a>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No activities available.</p>
        )}
      </div>
    </div>
  );
};

export default ActivitiesIIC;
