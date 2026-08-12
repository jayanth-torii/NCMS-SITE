import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const GalleryBanner = ({ data }: any) => {
  const { title, imageSrc, description } = data || {};

  return <PageBanner title={title || "Gallery"} eyebrow="Capturing Moments" subtitle={description} image={imageSrc} />;
};

export default GalleryBanner;
