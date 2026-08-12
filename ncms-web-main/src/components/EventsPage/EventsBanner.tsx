import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const EventsBanner = ({ data }: any) => {
  if (!data) return null;
  const { title, image } = data;

  return <PageBanner title={title || "Events"} eyebrow="Campus Events" image={image} />;
};

export default EventsBanner;
