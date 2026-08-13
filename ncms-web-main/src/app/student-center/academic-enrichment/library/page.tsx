"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import libraryDataJson from "@/data-export/library/data.json";
import { getLibrary } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const Library = () => {
  const { data } = useLiveData(getLibrary, libraryDataJson as any);
  return <CellPage data={data as any} eyebrow="Knowledge Hub" />;
};

export default Library;
