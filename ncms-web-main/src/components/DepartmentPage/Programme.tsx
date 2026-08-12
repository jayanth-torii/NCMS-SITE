"use client";
 
import React, { useEffect, useState } from "react";
import { Button, Card, Tabs } from "@mantine/core";
import { useRouter } from "next/navigation";
 
 
const programmeOptions: Record<string, string[]> = {
  ug: [
    "Commerce & Management",
    "Computer Application",
    "Science",
  ],
  pg: ["Masters In Business Administration", "Masters Of Commerce", "Masters of Computer Application"],
  language: [
    "Department of Kannada",
    "Department Of Hindi",
    "Department Of English",
  ],
};
 
const Programme = ({data}:any) => {
   if (!data) return null;
  const {title, description} = data;
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  // Set default tab based on URL hash on initial load
  useEffect(() => {
    const hash = window.location.hash.replace("#", ""); // Remove hash symbol
    if (hash && ["ug_programme", "pg_programme", "language"].includes(hash)) {
      setSelectedTab(hash.split("_")[0]); // Extract "ug", "pg", or "language"
    } else {
      setSelectedTab("ug"); // Default to UG if no valid hash
    }
  }, []);

  // Update URL hash when the tab changes
  useEffect(() => {
    if (selectedTab && window.location.hash !== `#${selectedTab}_programme`) {
      window.location.hash = `${selectedTab}_programme`;
    }
  }, [selectedTab]);
 
  const handleProgrammeClick = (programme: string) => {
    router.push(`/department?programme=${encodeURIComponent(programme)}`);
  };
  
  return (
    <div className="min-h-screen text-black p-1 w-[90%] mx-auto text-left">
      {/* Header Section */}
      <header className="py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0E2455]">
          {title || ""}
        </h1>
      </header>
 
      {/* Tabs Section */}
      <div className="w-full mb-6">
       <Tabs value={selectedTab} onChange={setSelectedTab} className="w-full">
          <Tabs.List className="relative flex flex-col md:flex-row md:justify-start border-b-2 border-[#D9D9D9]">
            {["ug", "pg", "language"].map((tab) => (
              <Tabs.Tab
                key={tab}
                value={tab}
                className="  text-center px-6 py-3 font-semibold relative transition-none"
                style={{
                  borderBottom: selectedTab === tab ? "4px solid #F09300" : "4px solid #D9D9D9",
                  color: "#003333",
                  fontSize: "1.2rem",
                  fontWeight: selectedTab === tab ? "700" : "400",
                }}
              >
                  {tab === "language" ? "LANGUAGE" : `${tab.toUpperCase()} PROGRAMME`}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </div>
 
      
      {/* Image and Programme List Section Responsive */}
      <div className="w-full flex flex-col md:flex-row gap-6">
        {/* Image Section */}
        <div className="w-full md:w-[30%] flex justify-center items-center">
          <img
            src="images/programme.png"
            alt="Nagarjuna Group of Institutions"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
 
        {/* Programme List Section */}
        <div className="w-full md:w-[70%]">
          <p className="text-justify text-gray-700 font-normal my-6">
             {description || ""}
          </p>
          <h2 className="text-lg mb-4 text-[#0E2455]">
            Explore {selectedTab?.toUpperCase()} Programmes
          </h2>
          <div className="space-y-2 border-t border-[#D9D9D9]">
          {programmeOptions[selectedTab ?? "ug"]?.map((programme: string) => (
            <div key={programme} className="flex justify-between items-center bg-[#F5F5F5] px-4 py-3">
              <span className="text-[11px] sm:text-[8px] md:text-[14px] lg:text-[20px] font-semibold text-[#0E2455]">
                {programme}
              </span>
              <Button
                onClick={() => handleProgrammeClick(programme)}
                variant="filled"
                size="sm"
                className="text-[white] px-2 md:px-4 font-semibold py-2 !bg-[#0E2455] rounded-md cursor-pointer"
              >
                View →
              </Button>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Programme;