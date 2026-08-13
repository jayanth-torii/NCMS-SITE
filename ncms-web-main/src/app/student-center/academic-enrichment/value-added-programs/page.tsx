"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import valueAddedDataJson from "@/data-export/value-added-course/data.json";
import { getValueAddedCourse } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const ValueAddedPrograms = () => {
  const { data } = useLiveData(getValueAddedCourse, valueAddedDataJson as any);
  return <CellPage data={data as any} eyebrow="Value Added Programmes" />;
};

export default ValueAddedPrograms;
