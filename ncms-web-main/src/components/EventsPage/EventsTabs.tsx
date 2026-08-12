"use client";

import React, { useState, useRef, ReactNode, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaChevronRight, FaBars } from "react-icons/fa";

import GuestLectures from "./GuestLectures";
import UtKarsh from "./UtKarsh";
import Conferences from "./Conferences";
import IndustrialVisit from "./IndustrialVisit";
import Sports from "./Sports";
import NssEvents from "./NssEvents";
import CulturalEvents from "./CulturalEvents";


const tabs = [
  "Guest Lectures",
  "Industrial Visit",
  "Sports",
  "NSS",
  "Cultural Events",
  "Conferences",
  "Utkarsh 2k23",

];

const tabComponents: Record<string, ReactNode> = {
  "Guest Lectures" :  <Suspense fallback={<p>Loading...</p>}><GuestLectures /></Suspense>,
  "Industrial Visit": <Suspense fallback={<p>Loading...</p>}><IndustrialVisit /></Suspense>,
  "Sports": <Suspense fallback={<p>Loading...</p>}><Sports /></Suspense>,
  "NSS": <Suspense fallback={<p>Loading...</p>}><NssEvents /></Suspense>,
  "Cultural Events": <Suspense fallback={<p>Loading...</p>}><CulturalEvents /></Suspense>,
  "Conferences": <Suspense fallback={<p>Loading...</p>}><Conferences /></Suspense>,
  "Utkarsh 2k23": <Suspense fallback={<p>Loading...</p>}><UtKarsh /></Suspense>,
};

export default function EventsTabs() {
  const searchParams = useSearchParams();
  const department = searchParams.get("programme") || "Computer Science & Engineering"; // Default department
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null); // Create content ref
    const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setMenuOpen(false);
    // Scroll to content on tab change
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <div className="relative flex flex-col md:flex-row w-full min-h-screen mb-20">

      {/* Mobile Hamburger Menu */}
      <div className="relative w-20 -mt-20 md:hidden flex justify-end px-1 self-end">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative flex items-center justify-center w-12 h-12 bg-[#F6F6F6] rounded-full shadow-lg focus:outline-none"
        >
          {/* Three Orange Dots */}
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-1">
            <span className="w-2 h-2 bg-[#F09300] rounded-full"></span>
            <span className="w-2 h-2 bg-[#F09300] rounded-full"></span>
            <span className="w-2 h-2 bg-[#F09300] rounded-full"></span>
          </span>
        </button>
      </div>


      {/* Sidebar Navigation - Hidden on Mobile */}
      <aside
        className={`md:w-[15%] md:block ${  
          menuOpen ? "absolute block shadow-lg" : "hidden"
        } md:relative w-2/3 md:w-[35%] lg:w-[20%] bg-white border-r border-gray-300 p-2 z-10`}
        style={{ alignSelf: "flex-start" }}
      >

        <nav className="flex flex-col space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`flex items-center cursor-pointer justify-between cursor-pointer px-4 py-2 !font-semibold text-left w-full !text-lg ${
                activeTab === tab ? "bg-[#0E2455] text-white" : "text-gray-800 hover:bg-gray-200"
              }`}
            >
              {tab}
              <FaChevronRight className="w-4 h-4" />
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main ref={contentRef} className="w-full md:w-[85%] p-4 text-[#003333]">
        {tabComponents[activeTab] || <p>Content not available.</p>}
      </main>
    </div>
  );
}
