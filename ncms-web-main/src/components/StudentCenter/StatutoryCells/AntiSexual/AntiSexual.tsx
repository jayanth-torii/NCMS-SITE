"use client"

import React, { Suspense } from "react";
import Banner from "../../CommonComponents/Banner";
import AboutVisionMission from "../../CommonComponents/AboutVisionMission";
import ActivitiesSection from "../../CommonComponents/Activities";
import PolicyAndComposition from "@/components/StudentCenter/CommonComponents/PoliciesAndComposition";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

import antiSexualDataJson from "@/data-export/anti-sexual-harassment-cell/data.json";
import { getAntiSexualHarassment } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";
 

const AntiSexualSection = () => {
  const { data: antiSexualData } = useLiveData(getAntiSexualHarassment, antiSexualDataJson as any);

  if (!antiSexualData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading Anti Sexual Harassment Cell...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Activities,
    Policies_And_Composition,
  } = antiSexualData;

  return (
    <div>
      <Banner data={BannerSection} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <AboutVisionMission data={AboutVisionMissionSections} />

      <ActivitiesSection data={Activities} />

      <PolicyAndComposition data={Policies_And_Composition} />
    </div>
  );
};

export default AntiSexualSection;
