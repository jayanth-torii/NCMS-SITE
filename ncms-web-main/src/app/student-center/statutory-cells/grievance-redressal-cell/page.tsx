"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import grievanceDataJson from "@/data-export/grievenvance-redressal-cell/data.json";
import { getGrievanceRedressal } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const GrievanceRedressalCell = () => {
  const { data } = useLiveData(getGrievanceRedressal, grievanceDataJson as any);
  return <CellPage data={data as any} eyebrow="Fair & Transparent" />;
};

export default GrievanceRedressalCell;
