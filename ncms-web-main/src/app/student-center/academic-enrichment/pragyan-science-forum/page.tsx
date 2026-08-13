"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import pragyanDataJson from "@/data-export/pragyan-science-forum/data.json";
import { getPragyanScienceForum } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const PragyanScienceForum = () => {
  const { data } = useLiveData(getPragyanScienceForum, pragyanDataJson as any);
  return <CellPage data={data as any} eyebrow="Pragyan Science Forum" />;
};

export default PragyanScienceForum;
