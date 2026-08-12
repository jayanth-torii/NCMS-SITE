"use client";

import React, { Suspense } from "react";

import Breadcrumb from '@/components/StudentCenter/CommonComponents/BreadCrumb';
import AboutSamsthitha from '@/components/StudentCenter/AboutSamsthitha';
import StudenCenterBanner from '@/components/StudentCenter/Banner';
import KnowEverything from '@/components/StudentCenter/KnowEverything';
import MaitriSamithi from '@/components/StudentCenter/MaitriSamithi';
import Policy from '@/components/StudentCenter/Policy';
import Progression from '@/components/StudentCenter/Progression';
import SamsthithaActivities from '@/components/StudentCenter/SamsthithaActivities';

import studentCenterData from "@/data-export/student-center-content/data.json";
import { getStudentCenter } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

function StudentCenter() {
  const { data: liveData } = useLiveData(getStudentCenter, studentCenterData);

  return (
    <div className="m-auto w-[90%]">
      <StudenCenterBanner   />
      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <KnowEverything />

      <MaitriSamithi data={liveData?.newsletterData} />
      <Policy data={liveData?.policyAndComposition} />
      <AboutSamsthitha data={liveData?.aboutSamsthitha} />
      <SamsthithaActivities data={liveData?.samsthithaActivities} />
      <Progression data={liveData?.progression} />
    </div>
  );
}

export default StudentCenter;
