import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const NewsLetterBanner = ({ data }: any) => {
  if (!data) return null;
  const { title, image } = data;

  return <PageBanner title={title || "Newsletter"} eyebrow="Nudi Chaitanya" image={image} />;
};

export default NewsLetterBanner;
