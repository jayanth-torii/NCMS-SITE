"use client";

import React, { Suspense } from "react";
import { Box } from "@mantine/core";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import PlacementBanner from "@/components/PlacementPage/PlacementBanner";
import AboutPlacements from "@/components/PlacementPage/AboutPlacements";
import KnowledgePartners from "@/components/PlacementPage/KnowledgePartners";
import OurRecrutingPartners from "@/components/PlacementPage/OurRecrutingPartners";
import OurCollaboration from "@/components/PlacementPage/OurCollaboration";
import Activites from "@/components/PlacementPage/Activites";

import placementData from "@/data-export/placement/data.json";
import { getPlacement } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const Placement = () => {
  const { data: liveData } = useLiveData(getPlacement, placementData);
  return (
    <Box style={{ margin: "auto", width: "90%" }}>
      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <PlacementBanner data={liveData?.banner} />
      <KnowledgePartners data={liveData?.knowledgePartners} />
      <AboutPlacements data={liveData?.aboutVisionMission} />
      <OurRecrutingPartners data={liveData?.recruttingPartners} />
      <OurCollaboration data={liveData?.collaboration} />
      <Activites data={liveData?.activities} />
    </Box>
  );
};

export default Placement;
