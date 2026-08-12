import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const NewsClippingsBanner = ({ data }: any) => {
  if (!data) return null;
  const { title, image } = data;

  return <PageBanner title={title || "News Coverage"} eyebrow="In The News" image={image} />;
};

export default NewsClippingsBanner;
