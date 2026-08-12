"use client";
import React, { useEffect, useState } from "react";
import { Tabs } from "@mantine/core";
import { useRouter, usePathname } from "next/navigation";
import { AiOutlineArrowRight } from "react-icons/ai";
import StudentCenterContent from "@/app/Data/StudentCenterContent";
import Image from "next/image";

type Tab = "Statutory Cells" | "Academic Enrichment" | "Community Services";

// Map child slugs -> their parent tab
const CHILD_TO_TAB: Record<string, Tab> = {
  // Statutory Cells
  "anti-ragging-cell": "Statutory Cells",
  "anti-sexual-harassment-cell": "Statutory Cells",
  "grievenvance-redressal-cell": "Statutory Cells",
  "sc-st-obc-cell": "Statutory Cells",
  "unity-council": "Statutory Cells",
  "human-rights-cell": "Statutory Cells",

  // Academic Enrichment
  "value-added-programs": "Academic Enrichment",
  "ed-cell": "Academic Enrichment",
  "research-cell": "Academic Enrichment",
  "library": "Academic Enrichment",
  "commerce-forum": "Academic Enrichment",
  "nptel-local-chapter": "Academic Enrichment",
  "pragyan-science-forum": "Academic Enrichment",

  // Community Services
  "nss": "Community Services",
  "cultural-committee": "Community Services",
  "ncc": "Community Services",
  "sakhi-samrudhi-women-empowerment-cell": "Community Services",
  "kala-chaitanya": "Community Services",
};

const parentSlugToTab: Record<string, Tab> = {
  "statutory-cells": "Statutory Cells",
  "academic-enrichment": "Academic Enrichment",
  "community-services": "Community Services",
};

const KnowEverything = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedTab, setSelectedTab] = useState<Tab | null>(null);

  // Decide tab from URL hash OR pathname (parent or child) before writing hash
  useEffect(() => {
    // 1) If hash is present and valid, prefer it
    const rawHash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
    const hash = decodeURIComponent(rawHash);
    if (StudentCenterContent.tabsList.includes(hash as Tab)) {
      setSelectedTab(hash as Tab);
      return;
    }

    // 2) Derive from pathname
    const segments = pathname.split("/").filter(Boolean); // e.g. ["student-center","academic-enrichment","value-added-programs"]

    // Parent present?
    for (const seg of segments) {
      if (parentSlugToTab[seg]) {
        setSelectedTab(parentSlugToTab[seg]);
        return;
      }
    }
    // Child present?
    for (const seg of segments) {
      if (CHILD_TO_TAB[seg]) {
        setSelectedTab(CHILD_TO_TAB[seg]);
        return;
      }
    }

    // 3) Fallback
    setSelectedTab("Statutory Cells");
  }, [pathname]);

  // Keep URL hash in sync with the selected tab (but don't overwrite a correct hash)
    useEffect(() => {
        if (!selectedTab) return;
            const desired = `#${selectedTab}`;
        if (typeof window !== "undefined" && window.location.hash !== desired) {
            window.location.hash = selectedTab;
        }
    }, [selectedTab]);

    const handleProgrammeClick = (programmePath: string) => {
        if (!selectedTab) return;
        const tabPath = selectedTab.toLowerCase().replace(/\s+/g, "-");
        router.push(`/student-center/${tabPath}/${programmePath}`);
    };

    return (
        <div className="mb-10 md:mb-20">
            <header className="mb-6">
                <h1 className="text-xl md:text-3xl font-bold text-[#0E2455]">{StudentCenterContent.title}</h1>
            </header>
            <div className="mb-6">
                <Tabs value={selectedTab} onChange={(value) => setSelectedTab(value as Tab)}>
                    <Tabs.List className="relative flex flex-col md:flex-row border-b-2 border-[#D9D9D9] space-x-5  ">
                        {StudentCenterContent.tabsList.map((tab) => (
                            <Tabs.Tab
                                key={tab}
                                value={tab}
                                className={`text-start py-3 !font-semibold !text-[#003333] !text-xl ${selectedTab === tab ? "!border-b-4 !border-[#F09300] font-bold" : ""}`}
                            >
                                {tab}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 flex-row">
                <div className="relative w-full h-72 lg:h-full">
                    <Image
                        src={StudentCenterContent.imageSrc}
                        alt="Nagarjuna Group of Institutions"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div>
                    <div className="flex flex-col w-full h-full border border-[#0E2455] p-6 justify-center">
                        <p className=" text-[#0E2455] font-normal mb-8">
                            {StudentCenterContent.description}
                        </p>
                        <h2 className="text-lg md:text-xl mb-8 text-[#0E2455] border-b border-[#D9D9D9]">
                            Explore {selectedTab}
                        </h2>
                        <div className="space-y-2">
                            {(selectedTab ? StudentCenterContent.programmeOptions[selectedTab] : []).map((programme, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center bg-[#F6F6F6] px-4 py-3 duration-200"
                                >
                                    <span className="text-[#0e2455] font-medium text-lg">{programme.name}</span>
                                    <button
                                        className="flex items-center cursor-pointer border px-8 py-2 text-[#0e2455] hover:bg-[#0E2455] hover:text-[white] transition"
                                        onClick={() => handleProgrammeClick(programme.path)} 
                                    >
                                        View <AiOutlineArrowRight className="ml-2" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowEverything;
