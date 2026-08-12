"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import NewsClippingsBanner from "@/components/NewsClippings/NewsClippingsBanner";
import Newses from "@/components/NewsClippings/Newses";

import newsClippingsData from "@/data-export/news-clippings/data.json";
import { getNewsClippings } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

function NewsClippings() {
  const { data: liveData } = useLiveData(getNewsClippings, newsClippingsData);
  return (
    <div className="m-auto w-[90%] mb-20">
      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <NewsClippingsBanner data={liveData.BannerSection} />
      <Newses data={liveData.News_Imges_Section} />
    </div>
  );
}

export default NewsClippings;
