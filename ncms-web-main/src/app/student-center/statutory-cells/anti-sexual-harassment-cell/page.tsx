"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import antiSexualDataJson from "@/data-export/anti-sexual-harassment-cell/data.json";
import { getAntiSexualHarassment } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const AntiSexualHarassmentCell = () => {
  const { data } = useLiveData(getAntiSexualHarassment, antiSexualDataJson as any);
  return <CellPage data={data as any} eyebrow="Safety & Dignity" />;
};

export default AntiSexualHarassmentCell;
