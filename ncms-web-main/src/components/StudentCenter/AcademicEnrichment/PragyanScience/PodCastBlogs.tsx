"use client";

import React from "react";
import Image from "next/image";

interface PodCastBlogsProps {
  data: {
    title: string;
    description: string;
    TextOne: string;
    TextTwo: string;
    TextOneLink: string;
    TextTwoLink: string;
    image: string;
  };
}

export default function PodCastBlogs({ data }: { data: PodCastBlogsProps["data"] }) {
  if (!data) return null;

  return (
    <div>
      <div className="items-center gap-6 flex flex-col md:flex-row mb-10 md:mb-16">
        {/* Text Section */}
        <div className="space-y-4 bg-[#F6F6F6] p-6 h-74 md:h-80 w-full md:w-[40%]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003333]">
            {data.title || "Default Title"}
          </h2>
          <p className="text-[#0E2455] mb-5">
            {data.description || "Default Description"}
          </p>

          {/* Conditionally Render Links */}
          <div className="flex flex-col space-y-6 w-full sm:w-1/2 md:w-4/5 lg:w-3/5 whitespace-nowrap">
            {data.TextOne && data.TextOneLink && (
              <a
                href={data.TextOneLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center px-5 py-2 text-[#0E2455] border border-[#000000] font-semibold cursor-pointer"
              >
                {data.TextOne}
              </a>
            )}
            {data.TextTwo && data.TextTwoLink && (
              <a
                href={data.TextTwoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center px-5 py-2 bg-[#0E2455] text-white font-semibold cursor-pointer"
              >
                {data.TextTwo}
              </a>
            )}
          </div>
        </div>

        {/* Image Section */}
        <div className="relative w-full h-64 md:h-80 w-full md:w-[60%]">
          {data?.image ? (
            <Image src={data.image} alt="Podcast Image" fill objectFit="cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
              No Image Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
