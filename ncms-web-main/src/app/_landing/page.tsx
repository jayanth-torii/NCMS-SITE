"use client";

import React from "react";
import HomeMain from "@/components/HomeNCET/HomeMain";

import homePageData from "@/data-export/home-page/data.json";
import applyNowStatic from "@/data-export/apply-now/data.json";
import { getHome } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const Landing = () => {
  const { data: apiData } = useLiveData(getHome, homePageData);

  const merged = {
    ...(apiData || homePageData),
    applyNow: (applyNowStatic as any).data || applyNowStatic,
  };

  return <HomeMain apiData={merged} />;
};

export default Landing;
