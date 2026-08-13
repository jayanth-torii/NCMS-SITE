"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import researchDataJson from "@/data-export/research-cell/data.json";
import { getResearchCell } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const ResearchCell = () => {
  const { data } = useLiveData(getResearchCell, researchDataJson as any);
  return <CellPage data={data as any} eyebrow="Research Cell" />;
};

export default ResearchCell;
