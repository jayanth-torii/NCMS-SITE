"use client";

import React, { Suspense } from "react";
import { Box } from "@mantine/core";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import AntiRaggingBanner from "@/components/StudentCenter/StatutoryCells/AntiRaggingCell/AntiRaggingBanner";
import AboutAntiRaggingPolicy from "@/components/StudentCenter/StatutoryCells/AntiRaggingCell/AboutAntiRaggingPolicy";
import AntiRaggingCell from "@/components/StudentCenter/StatutoryCells/AntiRaggingCell/AntiRaggingCell";
import AntiRaggingCommittee from "@/components/StudentCenter/StatutoryCells/AntiRaggingCell/AntiRaggingCommittee";

import antiRaggingDataJson from "@/data-export/anti-ragging/data.json";
import { getAntiRagging } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const AntiRaggingPolicy = () => {
  const { data: antiRaggingData } = useLiveData(getAntiRagging, antiRaggingDataJson as any);

  if (!antiRaggingData) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading Anti Ragging Cell...
      </div>
    );
  }

  return (
    <Box style={{ margin: "auto", width: "90%" }}>
      <AntiRaggingBanner data={antiRaggingData.banner} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <AboutAntiRaggingPolicy data={antiRaggingData.aboutAntiRagging} />
      <AntiRaggingCell data={antiRaggingData.antiRaggingCell} />
      <AntiRaggingCommittee data={antiRaggingData.antiRaggingCommittee} />
    </Box>
  );
};

export default AntiRaggingPolicy;
