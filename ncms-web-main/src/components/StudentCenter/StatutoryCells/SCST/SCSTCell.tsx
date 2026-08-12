"use client"

import { Suspense } from "react"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Banner from "../../CommonComponents/Banner";
import AboutVisionMission from "../../CommonComponents/AboutVisionMission";
import PolicyAndComposition from "../../CommonComponents/PoliciesAndComposition";

import SCSTDataJson from "@/data-export/sc-and-st/data.json";
import { getScAndSt } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const SCST = () => {
  const { data: SCSTData } = useLiveData(getScAndSt, SCSTDataJson as any);
    
  if (!SCSTData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading SC ST OBC Cell...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Policies_And_Composition,
  } = SCSTData;

  return (
    <div className="m-auto w-[90%]">
      <Banner data={BannerSection} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <AboutVisionMission data={AboutVisionMissionSections} />

      <PolicyAndComposition data={Policies_And_Composition} />
    </div>
  );
};

export default SCST;