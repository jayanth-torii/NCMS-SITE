"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Banner from "@/components/StudentCenter/CommonComponents/Banner";
import AboutVisionMission from "@/components/StudentCenter/CommonComponents/AboutVisionMission";
import PolicyAndComposition from "@/components/StudentCenter/CommonComponents/PoliciesAndComposition";
import OurGallery from "@/components/StudentCenter/CommonComponents/OurGallery";
import AccordionActivites from "@/components/StudentCenter/CommonComponents/AccordionActivites";

import sswecDataStatic from "@/data-export/sakhi-samrudhi-women-empowerment-cell/data.json";
import { getSakhiSamrudhi } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

function SSWEC() {
  const { data } = useLiveData(getSakhiSamrudhi, sswecDataStatic as any);

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading SSWEC...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Policies_And_Composition,
    Our_Gallery,
    Activities,
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

      {Our_Gallery && (
        <OurGallery StudentCenterData={Our_Gallery} />
      )}

      {Activities && (
        <AccordionActivites data={Activities} />
      )}
    </div>
  );
}

export default SSWEC;
