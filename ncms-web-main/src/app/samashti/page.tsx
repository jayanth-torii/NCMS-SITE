"use client";

import React from "react";

import SamashtiBanner from "@/components/SamashtiPage/SamashtiBanner";
import SamashtiAbout from "@/components/SamashtiPage/SamashtiAbout";
import ViewEditions from "@/components/SamashtiPage/ViewEditions";
import SamashtiJoin from "@/components/SamashtiPage/SamashtiJoin";

import samashtiData from "@/data-export/samashti/data.json";
import { getSamashti } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const Samashti = () => {
  const { data: liveData } = useLiveData(getSamashti, samashtiData as any);
  const d: any = liveData || (samashtiData as any).data || samashtiData;

  const editionCount = d?.viewEditionSection?.programs?.length || 0;

  return (
    <div className="sms-page">
      <SamashtiBanner data={d?.banner} />
      <SamashtiAbout data={d?.aboutSection} editionCount={editionCount} />
      <ViewEditions data={d?.viewEditionSection} />
      <SamashtiJoin />
    </div>
  );
};

export default Samashti;
