import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const Banner = ({ data }: any) => {
  if (!data) return null;
  const { title, image } = data;

  return <PageBanner title={title || "Student Center"} eyebrow="Student Center" image={image} />;
};

export default Banner;
