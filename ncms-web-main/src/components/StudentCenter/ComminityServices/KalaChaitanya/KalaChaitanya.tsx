"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Banner from "@/components/StudentCenter/CommonComponents/Banner";
import AboutVisionMission from "@/components/StudentCenter/CommonComponents/AboutVisionMission";
import PolicyAndComposition from "@/components/StudentCenter/CommonComponents/PoliciesAndComposition";
import OurGallery from "@/components/StudentCenter/CommonComponents/OurGallery";
import AccordionActivites from "@/components/StudentCenter/CommonComponents/AccordionActivites";

import kalaChaitanyaDataStatic from "@/data-export/kala-chaitanya/data.json";
import { getKalaChaitanya } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

function KalaChaitanya() {
  const { data } = useLiveData(getKalaChaitanya, kalaChaitanyaDataStatic as any);

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading KalaChaitanya...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Policies_And_Composition,
    Our_Gallery,
    Activities,
    UTube_Link,
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

 

            {/* U TUBE VIDEO */}
      <div className="w-full aspect-video mb-4 ">
        <iframe
          className="w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${UTube_Link} `}
          title="YouTube Video Player"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default KalaChaitanya;
