"use client";

import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const SamashtiBanner = ({ data, subtitle }: any) => {
  if (!data) return null;
  const { title, image } = data;

  return (
    <PageBanner
      title={(title || "Samashti").trim()}
      eyebrow="Official Magazine"
      subtitle={
        subtitle ||
        "The official magazine of Nagarjuna Group of Institutions — campus stories, research, student achievements and faculty insights, all in one place."
      }
      image={image}
    />
  );
};

export default SamashtiBanner;
