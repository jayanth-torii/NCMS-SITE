"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import scStDataJson from "@/data-export/sc-and-st/data.json";
import { getScAndSt } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const ScStObcCell = () => {
  const { data } = useLiveData(getScAndSt, scStDataJson as any);
  return <CellPage data={data as any} eyebrow="Equality & Inclusion" />;
};

export default ScStObcCell;
