import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const ApplyNowBanner = ({ data }: any) => {
  if (!data) return null;
  const { BannerSection, Content } = data;

  return (
    <>
      <PageBanner
        title={Content?.title || "Apply Now"}
        eyebrow="Admissions 2025-26"
        subtitle="Take the first step toward a future-ready career at NCMS."
        image={BannerSection?.image}
      />
    </>
  );
};

export default ApplyNowBanner;
