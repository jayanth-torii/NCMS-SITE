import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const AntiRaggingBanner = ({ data }: any) => {
  if (!data) return null;
  const { title, image } = data;

  return <PageBanner title={title || "Anti-Ragging Cell"} eyebrow="Safe & Supportive Campus" image={image} />;
};

export default AntiRaggingBanner;
