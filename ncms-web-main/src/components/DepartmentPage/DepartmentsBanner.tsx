"use client";

import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const DepartmentsBanner = ({ data, subtitle }: any) => {
  if (!data) return null;
  const { title, image } = data;

  return (
    <PageBanner
      title={title || "Departments"}
      eyebrow="Academic Programmes"
      subtitle={subtitle}
      image={image}
      breadcrumbs={[{ label: "Home", path: "/" }, { label: "Departments" }]}
    />
  );
};

export default DepartmentsBanner;
