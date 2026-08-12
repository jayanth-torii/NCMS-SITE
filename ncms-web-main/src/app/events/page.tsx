"use client";

import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import EventsTabs from "@/components/EventsPage/EventsTabs";
import EventsBanner from "@/components/EventsPage/EventsBanner";
import eventsData from "@/data-export/event/data.json";
import { getEvents } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

 
type BannerSectionType = {
  id: number;
  title: string;
  image: string;
};

 
type EventsDataType = {
  BannerSection: BannerSectionType;
};
 

 
 
const Events = () => {
  const { data: liveData } = useLiveData(getEvents, eventsData);
  return (
    <div className="m-auto w-[90%]">
      <EventsBanner data={liveData.BannerSection} />

      <Suspense>
        <Breadcrumb className="ml-0" />
      </Suspense>

      <Suspense>
        <EventsTabs />
      </Suspense>
    </div>
  );
};

export default Events;
