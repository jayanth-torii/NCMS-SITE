"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import nccDataJson from "@/data-export/ncc/data.json";
import { getNcc } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const NCC = () => {
  const { data } = useLiveData(getNcc, nccDataJson as any);
  return <CellPage data={data as any} eyebrow="National Cadet Corps" />;
};

export default NCC;
