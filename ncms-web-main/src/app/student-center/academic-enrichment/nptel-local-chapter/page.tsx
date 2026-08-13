"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import nptelDataJson from "@/data-export/nptel-local-chapter/data.json";
import { getNptelLocalChapter } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const NptelLocalChapter = () => {
  const { data } = useLiveData(getNptelLocalChapter, nptelDataJson as any);
  return <CellPage data={data as any} eyebrow="NPTEL Local Chapter" />;
};

export default NptelLocalChapter;
