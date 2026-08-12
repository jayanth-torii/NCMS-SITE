import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const IICBanner = ({ data }: any) => {
  if (!data) return null;
  const { title, image } = data;

  return <PageBanner title={title || "IIC"} eyebrow="Institution's Innovation Council" image={image} />;
};

export default IICBanner;
