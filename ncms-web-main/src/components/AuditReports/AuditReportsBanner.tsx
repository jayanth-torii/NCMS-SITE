import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const AuditReportsBanner = ({ data }: any) => {
  if (!data) return null;
  const { title, image } = data;

  return <PageBanner title={title || "Audit Reports"} eyebrow="Transparency & Accountability" image={image} />;
};

export default AuditReportsBanner;
