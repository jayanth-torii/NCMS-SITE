"use client";

import React from "react";
import eventStatic from "@/data-export/event/data.json";
import { getEvents } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

type UtkarshData = {
  id: number;
  title: string;
  UTube_Link: string;
  Content: string[];
};

export default function UtKarsh() {
  const { data: event } = useLiveData(getEvents, eventStatic as any);
  const utkarshData = (event as any)?.Utkarsh as UtkarshData | null;

  if (!utkarshData) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="flex flex-col w-[90%] mx-auto mb-10">
      <h2 className="text-2xl font-bold text-[#003333] mb-4">{utkarshData.title}</h2>

      {utkarshData.Content?.map((each, index) => (
        <p key={index} className="text-justify text-[#0E2455] mb-2">{each}</p>
      ))}

      {/* Video Player */}
      <div className="w-full aspect-video mt-6">
        <iframe
          className="w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${utkarshData.UTube_Link}`}
          title="Utkarsh Video"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}