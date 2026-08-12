"use client";

import React from "react";
import Hero from "./Hero";
import StatsStrip from "./StatsStrip";
import AboutNcet from "./AboutNcet";
import Anniversary from "./Anniversary";
import Accreditations from "./Accreditations";
import StudyFeature from "./StudyFeature";
import Recruiters from "./Recruiters";
import CampusLife from "./CampusLife";
import CtaBand from "./CtaBand";
import Reveal from "./Reveal";
import galleryDataStatic from "@/data-export/gallery/data.json";
import deptBannersStatic from "@/data-export/department-banners/data.json";

const HomeMain = ({ apiData }: { apiData: any }) => {
  const c = apiData || {};
  const gallery = (galleryDataStatic as any).data || galleryDataStatic;
  const deptBanners = (deptBannersStatic as any).data || deptBannersStatic;
  const applyNow: any = c.applyNow || {};
  const ctaData = { image: applyNow.Content?.image };

  return (
    <>
      <div className="react-wrapper">
        <div className="react-wrapper-inner">
          <Hero data={c.banner} />
          <Reveal>
            <StatsStrip data={c.Records} />
          </Reveal>
          <Reveal>
            <AboutNcet data={c.aboutNcet} />
          </Reveal>
          <Reveal>
            <Anniversary data={c.yrs25Section} />
          </Reveal>
          <Reveal>
            <Accreditations data={c.accordination} />
          </Reveal>
          <Reveal>
            <StudyFeature data={c.educationData} banners={deptBanners} />
          </Reveal>
          <Reveal>
            <Recruiters data={c.placementPartners} />
          </Reveal>
          <Reveal>
            <CampusLife data={gallery?.imageData} />
          </Reveal>
          <Reveal>
            <CtaBand data={ctaData} />
          </Reveal>
        </div>
      </div>
    </>
  );
};

export default HomeMain;
