"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import Kicker from "@/components/ui/Kicker";
import { ArrowRight, Camera } from "lucide-react";

const GlimpseGallery = ({ data }: any) => {
  const router = useRouter();
  const items = data || [];

  if (!items || items.length === 0) return null;

  return (
    <section className="relative py-20 lg:py-24 bg-white overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[-5%] right-[-10%] w-[500px] h-[500px] bg-[#F6872A]/8 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[450px] h-[450px] bg-[#0e2455]/6 rounded-full blur-[120px] pointer-events-none z-0" />
      {/* Dashed ring accent */}
      <div className="absolute top-[12%] left-[4%] opacity-20 pointer-events-none z-0 hidden lg:block">
        <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="#F6872A" strokeWidth="3" strokeDasharray="10 8" />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-[1300px] relative z-10">
        {/* Header */}
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <Kicker className="mb-4">Gallery</Kicker>
            <h2 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight">
              A Glimpse of <span className="text-orange">NCMS</span>
            </h2>
            <p className="mt-4 text-gray-500 font-medium text-[15px] max-w-lg">
              Moments from campus life, events, and celebrations — captured through our lens.
            </p>
          </div>
          <button
            onClick={() => router.push("/gallery")}
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-white border-2 border-orange/40 text-navy px-6 py-3 font-bold text-[14px] transition-all duration-300 hover:border-orange hover:bg-orange/5"
          >
            View All Gallery
            <ArrowRight size={16} className="text-orange transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Reveal>

        {/* Bento collage */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {items.map((item: any, index: number) => {
              const isLarge = index === 0;
              const isWide = index === items.length - 1 && !isLarge;
              return (
                <button
                  key={index}
                  onClick={() => router.push("/gallery")}
                  aria-label={`NCMS gallery image ${index + 1}`}
                  className={`group relative overflow-hidden rounded-[26px] bg-surface-tint shadow-[var(--shadow-card)] transition-all duration-500 hover:shadow-[var(--shadow-card-hover)] ${
                    isLarge
                      ? "col-span-2 row-span-2 aspect-[4/5] lg:aspect-auto lg:h-full"
                      : isWide
                        ? "col-span-2 aspect-[16/10] lg:aspect-auto lg:h-full"
                        : "aspect-[4/5]"
                  }`}
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={`NCMS gallery ${index + 1}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-110"
                    />
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Tag chip */}
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/25">
                    <Camera size={12} />
                    {isLarge ? "Campus" : `Moment ${index}`}
                  </span>

                  {/* Hover CTA */}
                  <span className="absolute bottom-5 left-5 translate-y-3 text-white font-bold text-sm flex items-center gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    Explore
                    <ArrowRight size={15} />
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default GlimpseGallery;
