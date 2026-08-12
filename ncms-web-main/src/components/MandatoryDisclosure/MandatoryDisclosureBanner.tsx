import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const MandatoryDisclosureBanner = ({ data }: any) => {
  if (!data) return null;
  const { title, image } = data;

  return <PageBanner title={title || "Mandatory Disclosure"} eyebrow="Transparency & Compliance" image={image} />;
};

export default MandatoryDisclosureBanner;
