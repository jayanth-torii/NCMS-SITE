"use client";

import React, { Suspense } from "react";

import Banner from "@/components/StudentCenter/CommonComponents/Banner";
import OurGallery from "@/components/StudentCenter/CommonComponents/OurGallery";
 
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import AboutVisionMission from "@/components/StudentCenter/CommonComponents/AboutVisionMission";
 

import libraryDataStatic from "@/data-export/ncc/data.json";
import { getNcc } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";


function NCC() {
  const { data: libraryData } = useLiveData(getNcc, libraryDataStatic as any);
  if (!libraryData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading NCC...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Our_Gallery,
    
  } = libraryData;

  return (
    <div className="m-auto w-[90%]">
      <Banner data={BannerSection} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <AboutVisionMission data={AboutVisionMissionSections} />
      <OurGallery StudentCenterData={Our_Gallery} />
 
    </div>
  );
}

export default NCC;
