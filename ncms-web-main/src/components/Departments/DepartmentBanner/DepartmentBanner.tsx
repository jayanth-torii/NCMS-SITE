"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import PageBanner from "@/components/PageBanner/PageBanner";

import departmentBannersData from "@/data-export/department-banners/data.json";
import { getDepartmentBanners } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const DepartmentBanner: React.FC = () => {
  const searchParams = useSearchParams();
  const programme = searchParams.get("programme") || "";

  const { data: departmentData } = useLiveData(getDepartmentBanners, departmentBannersData as any);
  const contentMapping: Record<string, any> = {
    science: departmentData?.Science,
    "commerce and management": departmentData?.UG_Commerce,
    "computer application": departmentData?.UG_CA,
    "masters in business administration": departmentData?.MBA,
    "masters of commerce": departmentData?.MOC,
    "masters of computer application": departmentData?.MCA,
    "department of kannada": departmentData?.DOK,
    "department of hindi": departmentData?.DOH,
    "department of english": departmentData?.DOE,
  };

  // Normalize the programme from URL
  const normalizedProgramme = programme.toLowerCase().replace(/&/g, "and").trim();
  const content = contentMapping[normalizedProgramme];

  return (
    <PageBanner
      title={content?.title ?? "Departments"}
      eyebrow="Academic Programmes"
      image={content?.image}
    />
  );
};

export default DepartmentBanner;
