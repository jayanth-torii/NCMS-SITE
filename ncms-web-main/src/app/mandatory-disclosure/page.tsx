"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Policies from "@/components/MandatoryDisclosure/Policies";
import AffiliationOrders from "@/components/MandatoryDisclosure/AffiliationOrders";
import Reports from "@/components/MandatoryDisclosure/Reports";
import CampusInitiatives from "@/components/MandatoryDisclosure/CampusInitiatives";
import MandatoryDisclosureBanner from "@/components/MandatoryDisclosure/MandatoryDisclosureBanner";
import QuickLinks from "@/components/MandatoryDisclosure/QuickLinks";

import mandatoryDisclosureData from "@/data-export/mandatory-disclosure/data.json";
import { getMandatoryDisclosure } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

function MandatoryDisclosure() {
  const { data: liveData } = useLiveData(getMandatoryDisclosure, mandatoryDisclosureData);
  return (
    <div className="m-auto w-[90%] mb-20">
      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <MandatoryDisclosureBanner data={liveData?.banner} />
      <Policies data={liveData?.policies} />
      <QuickLinks
  data={{
    title: liveData?.quickLinks?.title,
    image: liveData?.quickLinks?.image, 
    links:
      liveData?.quickLinks?.sections?.map((item: any) => ({
        id: item.id,
        title: item.title,
        pdf: item.pdf,
        image: item.image || null, 
      })) || [],
  }}
/>

      <AffiliationOrders data={liveData?.affiliationOrders} />
      <Reports data={liveData?.reports} />
      <CampusInitiatives data={liveData?.campusInitiatives} />
    </div>
  );
}

export default MandatoryDisclosure;
