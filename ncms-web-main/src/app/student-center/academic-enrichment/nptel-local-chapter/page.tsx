"use client";

import React, { Suspense } from "react";

import Banner from "@/components/StudentCenter/CommonComponents/Banner";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import AboutVisionMission from "@/components/StudentCenter/CommonComponents/AboutVisionMission";
import PolicyAndComposition from "@/components/StudentCenter/CommonComponents/PoliciesAndComposition";

import nptelDataJson from "@/data-export/nptel-local-chapter/data.json";
import { getNptelLocalChapter } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

interface NPTELData {
  BannerSection: {
    title: string;
    image: string;
  };
  AboutVisionMissionSections: any;
  Establishment_Of_NPTL: any;
}

function NPTEL() {
  const { data: nptelData } = useLiveData(getNptelLocalChapter, nptelDataJson as NPTELData | null);

  if (!nptelData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading NPTEL...
      </div>
    );
  }

  const { BannerSection, AboutVisionMissionSections, Establishment_Of_NPTL } = nptelData;

  return (
    <div className="m-auto w-[90%]">
      <Banner data={BannerSection} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <AboutVisionMission data={AboutVisionMissionSections} />

      <PolicyAndComposition data={Establishment_Of_NPTL} />
    </div>
  );
}

export default NPTEL;
