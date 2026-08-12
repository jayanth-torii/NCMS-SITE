"use client"

import { Suspense } from "react"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Banner from "../../CommonComponents/Banner";
import AboutVisionMission from "../../CommonComponents/AboutVisionMission";
import PolicyAndComposition from "../../CommonComponents/PoliciesAndComposition";
 
import GRCDataJson from "@/data-export/grievenvance-redressal-cell/data.json";
import { getGrievanceRedressal } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";


const GRC = () => {
  const { data: GRCData } = useLiveData(getGrievanceRedressal, GRCDataJson as any);

  if (!GRCData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading Grievance Redressal Cell...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Policies_And_Composition,
  } = GRCData;

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

export default GRC;