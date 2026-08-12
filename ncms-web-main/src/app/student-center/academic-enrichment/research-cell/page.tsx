"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Banner from "@/components/StudentCenter/CommonComponents/Banner";
import AboutVisionMission from "@/components/StudentCenter/CommonComponents/AboutVisionMission";
import ResourcesEvents from "@/components/StudentCenter/AcademicEnrichment/ResearchCell/ResourcesEvents";
import PolicyAndComposition from "@/components/StudentCenter/CommonComponents/PoliciesAndComposition";
import Publications from "@/components/StudentCenter/AcademicEnrichment/ResearchCell/Publications";

import researchCellDataJson from "@/data-export/research-cell/data.json";
import { getResearchCell } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

interface DocumentItem {
  title: string;
  pdf: string;
}

interface SectionItem {
  TabName: string;
  Documents: DocumentItem[];
}

interface ResourcesAndEvents {
  title: string;
  Sections: SectionItem[];
}

interface ResearchCellData {
  BannerSection: any;
  AboutVisionMissionSections: any;
  Policies_And_Composition: any;
  Resources_And_Events: ResourcesAndEvents;
  Publications: any;
}


function ResearchCell() {
  const { data: researchCellData } = useLiveData(getResearchCell, researchCellDataJson as ResearchCellData | null);

  if (!researchCellData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading Research Cell...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Policies_And_Composition,
    Resources_And_Events,
    Publications: PublicationData
  } = researchCellData;

  return (
    <div className="m-auto w-[90%]">
      <Banner data={BannerSection} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <AboutVisionMission data={AboutVisionMissionSections} />

      <ResourcesEvents
        title={Resources_And_Events.title}
        tabsList={Resources_And_Events.Sections?.map((sec: any) => sec?.TabName)}
        tabContent={Resources_And_Events.Sections?.reduce((acc: any, sec: any) => {
          acc[sec.TabName] = sec?.Documents?.map((doc: any) => ({
            name: doc?.title,
            pdf: doc?.pdf
          }));
          return acc;
        }, {} as { [key: string]: { name: string; pdf: string }[] })}
      />

      <PolicyAndComposition data={Policies_And_Composition} />

      <Publications data={PublicationData} />
    </div>
  );
}

export default ResearchCell;
