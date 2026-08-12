import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const PlacementBanner = ({ data }: any) => {
  if (!data) return null;
  const { title, image } = data;

  return <PageBanner title={title || "Placements"} eyebrow="Building Careers" image={image} />;
};

export default PlacementBanner;
