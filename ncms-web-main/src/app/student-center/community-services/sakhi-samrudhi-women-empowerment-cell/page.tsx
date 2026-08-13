"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import sakhiDataJson from "@/data-export/sakhi-samrudhi-women-empowerment-cell/data.json";
import { getSakhiSamrudhi } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const SakhiSamrudhi = () => {
  const { data } = useLiveData(getSakhiSamrudhi, sakhiDataJson as any);
  return <CellPage data={data as any} eyebrow="Women Empowerment" />;
};

export default SakhiSamrudhi;
