"use client"

import { Suspense } from "react"

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Banner from "../../CommonComponents/Banner";
import AboutVisionMission from "../../CommonComponents/AboutVisionMission";
import ActivitiesSection from "../../CommonComponents/Activities";
import PolicyAndComposition from "../../CommonComponents/PoliciesAndComposition";

import HumanRightsDataJson from "@/data-export/human-rights-cell/data.json";
import { getHumanRights } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const HumanRightsSection = () => {
  const { data: HumanRightsData } = useLiveData(getHumanRights, HumanRightsDataJson as any);

  if (!HumanRightsData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading HumanRights Cell...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Report,
    Policies_And_Composition,
  } = HumanRightsData;

  return (
    <div className="m-auto w-[90%]">
      <Banner data={BannerSection} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <AboutVisionMission data={AboutVisionMissionSections} />

      <ActivitiesSection data={Report} />

      <PolicyAndComposition data={Policies_And_Composition} />
    </div>
  );
};


export default HumanRightsSection;