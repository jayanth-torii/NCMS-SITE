import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const UUCMSBanner = ({ data }: any) => {
  if (!data) return null;
  const { title, image } = data;

  return <PageBanner title={title || "UUCMS"} eyebrow="University & College Management System" image={image} />;
};

export default UUCMSBanner;
