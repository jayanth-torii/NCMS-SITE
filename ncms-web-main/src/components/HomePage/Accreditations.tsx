"use client";

import React from "react";
import Reveal from "@/components/ui/Reveal";
import Kicker from "@/components/ui/Kicker";
import { BadgeCheck } from "lucide-react";

const Accreditations = ({ data }: any) => {
  const { mainHead, title1, title2, images = [] } = data || {};
  if (!images || images.length === 0) return null;

  return (
    <section className="relative py-20 lg:py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-[0.04] pointer-events-none z-0" />

      <div className="container mx-auto px-4 lg:px-8 max-w-[1300px] relative z-10">
        <Reveal className="text-center mb-14">
          <div className="flex justify-center">
            <Kicker>Recognitions</Kicker>
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-navy tracking-tight">
            {mainHead || "Accreditations and Affiliations"}
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {title1 && (
              <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-body-gray">
                <BadgeCheck size={18} className="text-orange" />
                {title1}
              </span>
            )}
            {title2 && (
              <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-body-gray">
                <BadgeCheck size={18} className="text-orange" />
                {title2}
              </span>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {images.map((src: string, index: number) => (
              <div
                key={index}
                className="group flex items-center justify-center rounded-3xl border border-card-border bg-white px-6 py-10 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card-hover)] hover:border-orange/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Accreditation ${index + 1}`}
                  className="max-h-16 w-auto object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Accreditations;
