"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import NewsLetterBanner from "@/components/NewsLetter/NewsLetterBanner";
import AboutNewsLetter from "@/components/NewsLetter/AboutNewsLetter";
import Volumes from "@/components/NewsLetter/Volumes";

import newsLetterData from "@/data-export/news-letter/data.json";
import { getNewsLetter } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const NewsLetter = () => {
  const { data: liveData } = useLiveData(getNewsLetter, newsLetterData);
  return (
    <div className="m-auto w-[90%] mb-20">
      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <NewsLetterBanner data={liveData.banner} />
      <AboutNewsLetter data={liveData.AboutVisionMission} />
      <Volumes data={liveData.View_Volumes} />
    </div>
  );
};

export default NewsLetter;
