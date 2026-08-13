"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import antiRaggingDataJson from "@/data-export/anti-ragging/data.json";
import { getAntiRagging } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const AntiRaggingCell = () => {
  const { data } = useLiveData(getAntiRagging, antiRaggingDataJson as any);
  return <CellPage data={data as any} eyebrow="Safe & Supportive Campus" />;
};

export default AntiRaggingCell;
