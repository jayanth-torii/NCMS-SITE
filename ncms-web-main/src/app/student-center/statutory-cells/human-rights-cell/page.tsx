"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import humanRightsDataJson from "@/data-export/human-rights-cell/data.json";
import { getHumanRights } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const HumanRightsCell = () => {
  const { data } = useLiveData(getHumanRights, humanRightsDataJson as any);
  return <CellPage data={data as any} eyebrow="Rights & Dignity" />;
};

export default HumanRightsCell;
