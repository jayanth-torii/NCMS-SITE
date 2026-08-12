"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Banner from "@/components/StudentCenter/CommonComponents/Banner";
import AboutVAC from "@/components/StudentCenter/AcademicEnrichment/VAC/AboutVAC";
import YearWiseCourses from "@/components/StudentCenter/AcademicEnrichment/VAC/YearWiseCourse";

import vacDataStatic from "@/data-export/value-added-course/data.json";
import { getValueAddedCourse } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

function VACPage() {
  const { data: vacData } = useLiveData(getValueAddedCourse, vacDataStatic);
  if (!vacData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading valueadded Programs...
      </div>
    );
  }

  return (
    <div className="m-auto w-[90%]">
      <Banner data={vacData.BannerSection} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <AboutVAC
        about={vacData.About}
        objectives={vacData.Objectives}
      />

      <YearWiseCourses data={vacData.yearWiseCourses} />
    </div>
  );
}

export default VACPage;
