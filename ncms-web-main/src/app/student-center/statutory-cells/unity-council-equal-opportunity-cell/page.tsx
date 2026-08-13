"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import unityCouncilDataJson from "@/data-export/unity-counsil-content/data.json";
import { getUnityCouncil } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const UnityCouncilCell = () => {
  const { data } = useLiveData(getUnityCouncil, unityCouncilDataJson as any);
  return <CellPage data={data as any} eyebrow="Equal Opportunity" />;
};

export default UnityCouncilCell;
