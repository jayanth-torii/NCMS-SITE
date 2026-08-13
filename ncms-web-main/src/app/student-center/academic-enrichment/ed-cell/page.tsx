"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import edCellDataJson from "@/data-export/ed-cell/data.json";
import { getEdCell } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const EDCell = () => {
  const { data } = useLiveData(getEdCell, edCellDataJson as any);
  return <CellPage data={data as any} eyebrow="Entrepreneurship" />;
};

export default EDCell;
