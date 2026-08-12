"use client";

import React, { Suspense } from "react";
import { Box } from "@mantine/core";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import UUCMSBanner from "@/components/UUCMS/UUCMSBanner";
import StudentManual from "@/components/UUCMS/StudentManual";
import LoginPortals from "@/components/UUCMS/LoginPortals";
import CollegeManual from "@/components/UUCMS/CollegeManual";
import UniversityManual from "@/components/UUCMS/UniversityManual";

import UUCMSData from "@/data-export/uucms-content/data.json";
import { getUucms } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

type UUCMSDataType = {
  banner: { title: string; image: string };
  manualSection: { title: string; description: string; pdf: string; image: string };
  loginPortals: Array<{ title: string; description: string; link: string; image: string }>;
  collegeManualSection: { title: string; description: string; pdf: string; image: string };
  universityManualSection: { title: string; description: string; pdf: string; image: string };
};


const UUCMS = () => {
  const { data: liveData } = useLiveData(getUucms, UUCMSData);
  return (
    <Box style={{ margin: "auto", width: "90%" }}>
      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>
      <UUCMSBanner data={liveData?.banner} />
      <StudentManual data={liveData?.manualSection} />
      <LoginPortals data={liveData?.loginPortals} />
      <CollegeManual data={liveData?.collegeManualSection} />
      <UniversityManual data={liveData?.universityManualSection} />
    </Box>
  );
};

export default UUCMS;
