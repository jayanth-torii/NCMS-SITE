"use client";

import React from "react";

import StudenCenterBanner from "@/components/StudentCenter/Banner";
import KnowEverything from "@/components/StudentCenter/KnowEverything";
import MaitriSamithi from "@/components/StudentCenter/MaitriSamithi";
import Policy from "@/components/StudentCenter/Policy";
import AboutSamsthitha from "@/components/StudentCenter/AboutSamsthitha";
import SamsthithaActivities from "@/components/StudentCenter/SamsthithaActivities";
import Progression from "@/components/StudentCenter/Progression";

import studentCenterData from "@/data-export/student-center-content/data.json";
import { getStudentCenter } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

function StudentCenter() {
  const { data: liveData } = useLiveData(getStudentCenter, studentCenterData as any);

  return (
    <div className="sc-page">
      <StudenCenterBanner />

      <div className="container">
        <section className="sc-section">
          <KnowEverything />
        </section>

        <section className="sc-section">
          <MaitriSamithi data={liveData?.newsletterData} />
        </section>

        <section className="sc-section">
          <Policy data={liveData?.policyAndComposition} />
        </section>

        <section className="sc-section">
          <AboutSamsthitha data={liveData?.aboutSamsthitha} />
        </section>

        <section className="sc-section">
          <SamsthithaActivities data={liveData?.samsthithaActivities} />
        </section>

        <section className="sc-section">
          <Progression data={liveData?.progression} />
        </section>
      </div>
    </div>
  );
}

export default StudentCenter;
