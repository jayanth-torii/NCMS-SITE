"use client";

import React, { Suspense } from "react";
import { Box } from "@mantine/core";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ApplyNowBanner from "@/components/ApplyNow/ApplyNowBanner";
import QueryForm from "@/components/ApplyNow/QueryForm";

import applyNowData from "@/data-export/apply-now/data.json";
import { getApplyNow } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

type ApplyNowDataType = {
  BannerSection: {
    title: string;
    image: string;
  };
  Content: {
    title: string;
    image: string;
  };
};

const ContactUs = () => {
  const { data: liveData } = useLiveData(getApplyNow, applyNowData);
  return (
    <Box style={{ margin: "auto", width: "90%" }}>
      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>
      <ApplyNowBanner data={liveData} />
      <QueryForm />
    </Box>
  );
};

export default ContactUs;
