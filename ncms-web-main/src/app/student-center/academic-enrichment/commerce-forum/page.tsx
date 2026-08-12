"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Banner from "@/components/StudentCenter/CommonComponents/Banner";
import AboutVisionMission from "@/components/StudentCenter/CommonComponents/AboutVisionMission";
import OurGallery from "@/components/StudentCenter/CommonComponents/OurGallery";
import Activities from "@/components/StudentCenter/AcademicEnrichment/CommerceForum/Activities";

import commerceForumDataJson from "@/data-export/commerce-forum/data.json";
import { getCommerceForum } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

function CommerceForum() {
  const { data: commerceForumData } = useLiveData(getCommerceForum, commerceForumDataJson as any);

  if (!commerceForumData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading Commerce Forum...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    Our_Gallery,
    Activities: ActivitiesData
  } = commerceForumData;

  return (
    <div className="m-auto w-[90%]">
      <Banner data={BannerSection} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <AboutVisionMission data={AboutVisionMissionSections} />

      <OurGallery StudentCenterData={Our_Gallery} />

      <Activities data={ActivitiesData} />
    </div>
  );
}

export default CommerceForum;
