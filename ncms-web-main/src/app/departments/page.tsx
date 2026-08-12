"use client";

import React from "react";

import DepartmentsBanner from "@/components/DepartmentPage/DepartmentsBanner";
import DepartmentsDirectory from "@/components/DepartmentPage/DepartmentsDirectory";

import departmentPageData from "@/data-export/department-page/data.json";
import departmentBannersData from "@/data-export/department-banners/data.json";
import { getDepartmentsPage, getDepartmentBanners } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const Departments = () => {
  const { data: apiData } = useLiveData(getDepartmentsPage, departmentPageData as any);
  const { data: bannersData } = useLiveData(getDepartmentBanners, departmentBannersData as any);

  const page: any = apiData || (departmentPageData as any).data || departmentPageData;
  const banners: any = bannersData || (departmentBannersData as any).data || departmentBannersData;

  return (
    <div className="dptr-page">
      <DepartmentsBanner data={page?.bannerSection} subtitle={page?.programmes?.description} />
      <DepartmentsDirectory
        banners={banners}
        hero={page?.bannerSection}
        pillars={{
          heading: page?.challenge?.title || undefined,
          description: page?.challenge?.description || undefined,
          items: (page?.challenge?.images || []).slice(0, 3).map((img: any, i: number) => ({
            title: img?.alt || ["Research", "Industry", "Innovation"][i],
            text: img?.text || undefined,
            icon: ["research", "industry", "innovation"][i],
          })),
        }}
        showcase={page?.programmes}
      />
    </div>
  );
};

export default Departments;
