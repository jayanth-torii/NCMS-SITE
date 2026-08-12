"use client";

import React, { Suspense } from "react";

import Banner from "@/components/StudentCenter/CommonComponents/Banner";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import AboutVisionMission from "@/components/StudentCenter/CommonComponents/AboutVisionMission";
import PodCastBlogs from "@/components/StudentCenter/AcademicEnrichment/PragyanScience/PodCastBlogs";

import pragyanDataJson from "@/data-export/pragyan-science-forum/data.json";
import { getPragyanScienceForum } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

interface PragyanScienceData {
  BannerSection: {
    title: string;
    image: string;
  };
  AboutVisionMissionSections: any;
  PodcastAndBlogs: any;
}

function PragyanScienceForum() {
  const { data } = useLiveData(getPragyanScienceForum, pragyanDataJson as PragyanScienceData | null);

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading Pragyan Science Forum...
      </div>
    );
  }

  const {
    BannerSection,
    AboutVisionMissionSections,
    PodcastAndBlogs,
  } = data;

  return (
    <div className="m-auto w-[90%]">
      <Banner data={BannerSection} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <AboutVisionMission data={AboutVisionMissionSections} />

      <PodCastBlogs data={PodcastAndBlogs} />
    </div>
  );
}

export default PragyanScienceForum;
