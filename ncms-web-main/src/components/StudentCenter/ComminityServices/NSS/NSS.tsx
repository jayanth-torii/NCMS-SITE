"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Banner from "@/components/StudentCenter/CommonComponents/Banner";
import AboutVisionMission from "@/components/StudentCenter/CommonComponents/AboutVisionMission";
import PolicyAndComposition from "../../CommonComponents/PoliciesAndComposition";
import AccordionActivites from "../../CommonComponents/AccordionActivites";

import NSSDataJson from "@/data-export/nss/data.json";
import { getNss } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

  

function NSS() {
  const { data: NSSData } = useLiveData(getNss, NSSDataJson as any);

  if (!NSSData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading NSS...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Policies_And_Composition,
    Activities
  } = NSSData;

  return (
    <div className="m-auto w-[90%]">
      <Banner data={BannerSection} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <AboutVisionMission data={AboutVisionMissionSections} />

      <PolicyAndComposition data={Policies_And_Composition} />

      <AccordionActivites data={Activities} />
    </div>
  );
}

export default NSS;
