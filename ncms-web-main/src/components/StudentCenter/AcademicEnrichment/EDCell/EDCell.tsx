"use client"

import React, { Suspense } from "react";
import Banner from "../../CommonComponents/Banner";
import AboutVisionMission from "../../CommonComponents/AboutVisionMission";
import PolicyAndComposition from "@/components/StudentCenter/CommonComponents/PoliciesAndComposition";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

import EDCellDataStatic from "@/data-export/ed-cell/data.json";
import { getEdCell } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";
 

const EDCellPage = () => {
  const { data: EDCellData } = useLiveData(getEdCell, EDCellDataStatic as any);
  if (!EDCellData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading ED Cell...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Policies_And_Composition,
  } = EDCellData;

  return (
    <div className="m-auto w-[90%] ">
      <Banner data={BannerSection} />
      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>
      <AboutVisionMission data={AboutVisionMissionSections} />
      <PolicyAndComposition data={Policies_And_Composition} />
    </div>
  );
};

export default EDCellPage