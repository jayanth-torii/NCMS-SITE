"use client";

import React, { useEffect, useState, useRef } from "react";
import { Tabs } from "@mantine/core";

interface PublicationsProps {
  data: {
    title: string;
    TabSections: {
      TabName: string;
      Descriptions: string[];
    }[];
  };
}

const Publications: React.FC<PublicationsProps> = ({ data }) => {
  const tabsList = data.TabSections.map((tab) => tab.TabName);
  const tabContent: { [key: string]: string[] } = data.TabSections.reduce((acc, tab) => {
    acc[tab.TabName] = tab.Descriptions;
    return acc;
  }, {} as { [key: string]: string[] });

  const [selectedTab, setSelectedTab] = useState<string>(tabsList[0] || "");
  const scrollRef = useRef<HTMLDivElement>(null);

 
  // Scroll to top on tab change (no hash update to prevent reload)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedTab]);

  return (
    <div className="mb-10 md:mb-20">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0E2455]">{data.title}</h1>
      </header>

      <div className="mb-6">
        <Tabs value={selectedTab} onChange={(value) => value && setSelectedTab(value)}>
          <Tabs.List className="flex flex-col md:flex-row border-b-2 border-[#D9D9D9] space-x-5 text-xl">
            {tabsList.map((tab) => (
              <Tabs.Tab
                key={tab}
                value={tab}
                className={`text-start py-3 !text-[#003333] !text-xl !font-semibold ${
                  selectedTab === tab ? "!border-b-5 !border-[#F6872A] font-bold" : ""
                }`}
              >
                {tab}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </div>

      <div
        ref={scrollRef}
        className="overflow-y-auto orange-scrollbar"
        style={{ maxHeight: "600px" }}
      >
        <div className="flex flex-col w-full justify-center space-y-4">
          {tabContent[selectedTab]?.map((content, index) => (
            <div key={index} className="border-b border-[#ccc] px-4 pb-4">
              <p className="text-[#003333] text-justify whitespace-pre-line">
                {content}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .orange-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .orange-scrollbar::-webkit-scrollbar-track {
          background: #f3f3f3;
        }
        .orange-scrollbar::-webkit-scrollbar-thumb {
          background: #f09300;
          border-radius: 10px;
        }
        .orange-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d87d00;
        }
      `}</style>
    </div>
  );
};

export default Publications;
