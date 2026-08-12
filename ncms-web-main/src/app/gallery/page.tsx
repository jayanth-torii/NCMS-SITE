"use client";

import React from "react";

import GalleryBanner from "@/components/GalleryPage/GalleryBanner";
import GalleryImages from "@/components/GalleryPage/GalleryImages";

import galleryData from "@/data-export/gallery/data.json";
import { getGallery } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const Gallery = () => {
  const { data: liveData } = useLiveData(getGallery, galleryData as any);
  const d: any = liveData || (galleryData as any).data || galleryData;

  return (
    <>
      <GalleryBanner data={d.banner} />
      <GalleryImages data={d.imageData} />
    </>
  );
};

export default Gallery;
