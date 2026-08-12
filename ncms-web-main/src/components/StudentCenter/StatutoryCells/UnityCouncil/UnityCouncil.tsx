"use client"
import { Suspense } from "react"

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Banner from "../../CommonComponents/Banner";
import AboutVisionMission from "../../CommonComponents/AboutVisionMission";
import ActivitiesSection from "../../CommonComponents/Activities";
import PolicyAndComposition from "../../CommonComponents/PoliciesAndComposition";

import UnityCounsilDataJson from "@/data-export/unity-counsil-content/data.json";
import { getUnityCouncil } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const UnityCouncilSection = () => {
  const { data: UnityCounsilData } = useLiveData(getUnityCouncil, UnityCounsilDataJson as any);

  if (!UnityCounsilData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading Unity Council...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Activities,
    Policies_And_Composition,
  } = UnityCounsilData;

  return (
    <div className="m-auto w-[90%]">
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

export default UnityCouncilSection;