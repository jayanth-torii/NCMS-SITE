"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import culturalDataJson from "@/data-export/cultural-committee/data.json";
import { getCulturalCommittee } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const CulturalCommittee = () => {
  const { data } = useLiveData(getCulturalCommittee, culturalDataJson as any);
  return <CellPage data={data as any} eyebrow="Culture & Arts" />;
};

export default CulturalCommittee;
