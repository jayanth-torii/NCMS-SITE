"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Banner from "@/components/StudentCenter/CommonComponents/Banner";
import AboutVisionMission from "@/components/StudentCenter/CommonComponents/AboutVisionMission";
import PolicyAndComposition from "@/components/StudentCenter/CommonComponents/PoliciesAndComposition";

import culturalCommitteeDataStatic from "@/data-export/cultural-committee/data.json";
import { getCulturalCommittee } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

function CulturalCommittee() {
  const { data } = useLiveData(getCulturalCommittee, culturalCommitteeDataStatic as any);

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading Cultural Committee...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Policies_And_Composition,
  } = data;

  return (
    <div className="m-auto w-[90%]">
      <Banner data={BannerSection} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      {AboutVisionMissionSections && (
        <AboutVisionMission data={AboutVisionMissionSections} />
      )}

      {Policies_And_Composition && (
        <PolicyAndComposition data={Policies_And_Composition} />
      )}
    </div>
  );
}

export default CulturalCommittee;
