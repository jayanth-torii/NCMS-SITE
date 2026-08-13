"use client";

import React from "react";
import CellPage from "@/components/StudentCenter/CellPage/CellPage";
import commerceForumDataJson from "@/data-export/commerce-forum/data.json";
import { getCommerceForum } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const CommerceForum = () => {
  const { data } = useLiveData(getCommerceForum, commerceForumDataJson as any);
  return <CellPage data={data as any} eyebrow="Commerce Forum" />;
};

export default CommerceForum;
