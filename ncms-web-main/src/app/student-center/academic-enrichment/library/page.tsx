"use client";

import React, { Suspense } from "react";

import Banner from "@/components/StudentCenter/CommonComponents/Banner";
import OurGallery from "@/components/StudentCenter/CommonComponents/OurGallery";
import Overview from "@/components/StudentCenter/AcademicEnrichment/Library/Overview";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import AboutVisionMission from "@/components/StudentCenter/CommonComponents/AboutVisionMission";
import PolicyAndComposition from "@/components/StudentCenter/CommonComponents/PoliciesAndComposition";

import libraryDataStatic from "@/data-export/library/data.json";
import { getLibrary } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";


function LibraryPage() {
  const { data: libraryData } = useLiveData(getLibrary, libraryDataStatic);
  if (!libraryData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading Library...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Our_Gallery,
    Policies_And_Composition,
    Library_OverView,
  } = libraryData;

  return (
    <div className="m-auto w-[90%]">
      <Banner data={BannerSection} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <AboutVisionMission data={AboutVisionMissionSections} />
      <OurGallery StudentCenterData={Our_Gallery} />
      <PolicyAndComposition data={Policies_And_Composition} />
      <Overview data={Library_OverView} />
    </div>
  );
}

export default LibraryPage;
