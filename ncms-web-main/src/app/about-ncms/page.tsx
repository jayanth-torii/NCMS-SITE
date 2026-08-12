"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import PageBanner from "@/components/PageBanner/PageBanner";
import AboutPage from "@/components/AboutNCMS/AboutPage";

import aboutNcmsData from "@/data-export/about-ncms-college/data.json";
import homeData from "@/data-export/home-page/data.json";
import { getAboutNcms, getHome } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

function AboutBanner() {
  return (
    <PageBanner
      title="About NCMS"
      eyebrow="Nagarjuna College of Management Studies"
      subtitle="A legacy of academic excellence, innovation, and holistic development — shaping future-ready professionals in Commerce, Management &amp; Science."
      image="/images/contact_us_bannerr_512b0da77d.png"
    />
  );
}

const AboutNCMSPage = () => {
  const { data: liveAbout } = useLiveData(getAboutNcms, aboutNcmsData);
  const { data: liveHome } = useLiveData(getHome, homeData);
  return (
    <>
      <Suspense>
        <div className="border-b border-card-border bg-white">
          <div className="container mx-auto max-w-[1300px] px-4 py-3 lg:px-8">
            <Breadcrumb className="ml-0" />
          </div>
        </div>
      </Suspense>

      <AboutBanner />

      <AboutPage aboutData={liveAbout} impactStats={liveHome?.Records} />
    </>
  );
};

export default AboutNCMSPage;
