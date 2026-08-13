"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import nssDataJson from "@/data-export/nss/data.json";
import { getNss } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const NSS = () => {
  const { data } = useLiveData(getNss, nssDataJson as any);
  return <CellPage data={data as any} eyebrow="National Service Scheme" />;
};

export default NSS;
