"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import AuditReportsBanner from "@/components/AuditReports/AuditReportsBanner";
import Reports from "@/components/AuditReports/Reports";

import auditReportsData from "@/data-export/audit-report/data.json";
import { getAuditReport } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

export default function AuditReports() {
  const { data: liveData } = useLiveData(getAuditReport, auditReportsData);
  return (
    <div className="m-auto w-[90%] mb-20">
      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>
      <AuditReportsBanner data={liveData?.banner} />
      <Reports data={liveData?.auditReports} />
    </div>
  );
}
