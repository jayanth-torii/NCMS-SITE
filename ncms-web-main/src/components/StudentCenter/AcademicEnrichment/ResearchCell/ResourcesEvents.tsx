"use client";
import React, { useEffect, useState, useRef } from "react";
import { Tabs } from "@mantine/core";
import { AiOutlineArrowRight } from "react-icons/ai";
import PdfModal from "../../../PdfModal";

interface ResourcesEventsProps {
  title: string;
 
  tabsList: string[];
  tabContent: { [key: string]: { name: string; pdf: string }[] };
   
}

const ResourcesEvents: React.FC<ResourcesEventsProps> = ({
  title,
 
  tabsList,
  tabContent,
 
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(tabsList[0] || "");
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    if (selectedTab) {
      
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedTab]);

  const handleItemClick = (pdfPath: string) => {
    setSelectedPdf(pdfPath);
  };

  const closePdf = () => {
    setSelectedPdf(null);
  };

  return (
    <div className="mb-10 md:mb-20">
      {/* Header */}
      <header className="mb-6 space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0E2455]">
          {title}
        </h1>
      </header>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs value={selectedTab} onChange={(value) => value && setSelectedTab(value)}>
          <Tabs.List className="relative flex flex-col md:flex-row border-b-2 border-[#D9D9D9] space-x-5 !text-xl">
            {tabsList.map((tab) => (
              <Tabs.Tab
                key={tab}
                value={tab}
                className={`text-start py-3 !text-[#003333] !text-lg !md:text-xl !font-semibold ${
                  selectedTab === tab ? "!border-b-4 !border-[#F09300] font-bold" : ""
                }`}
              >
                {tab}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div
        ref={scrollRef}
        className="overflow-y-auto orange-scrollbar"
        style={{ maxHeight: "600px" }}
      >
        <div className="flex flex-col w-full justify-center space-y-2">
          {tabContent[selectedTab]?.length > 0 ? (
            tabContent[selectedTab].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-[#9E9E9E] px-4 py-3 duration-200"
              >
                <span className="text-justify text-[#0e2455]">{item.name}</span>
                <button
                  className="flex cursor-pointer items-center border px-3 py-1 text-[#0e2455] hover:bg-[#0E2455] hover:text-white transition"
                  onClick={() => handleItemClick(item.pdf)}
                >
                  View <AiOutlineArrowRight className="ml-2" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-[#999] px-4 py-3">
              No documents available in this tab.
            </div>
          )}
        </div>
      </div>

      {/* PDF Modal */}
      {selectedPdf && <PdfModal pdfUrl={selectedPdf} onClose={closePdf} />}

      {/* Custom Scrollbar Styling */}
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

export default ResourcesEvents;
