"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import kalaDataJson from "@/data-export/kala-chaitanya/data.json";
import { getKalaChaitanya } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const KalaChaitanya = () => {
  const { data } = useLiveData(getKalaChaitanya, kalaDataJson as any);
  return <CellPage data={data as any} eyebrow="Kala Chaitanya" />;
};

export default KalaChaitanya;
