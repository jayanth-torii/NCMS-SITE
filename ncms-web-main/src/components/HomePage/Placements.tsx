"use client";

import React from "react";
import Reveal from "@/components/ui/Reveal";

const Placements = ({ data }: any) => {
  const partners = data || [];
  if (!partners || partners.length === 0) return null;

  const renderTile = (partner: any, keyPrefix: string) => (
    <div
      key={`${keyPrefix}-${partner.id ?? partner.name}`}
      className="group/logo flex-shrink-0 w-[190px] h-[120px] rounded-2xl flex items-center justify-center p-5 mx-[12px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(246,135,42,0.28)] hover:ring-2 hover:ring-orange/60 transition-all duration-500"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={partner.logo}
        alt={partner.name}
        loading="lazy"
        className="max-w-[140px] max-h-[64px] w-auto object-contain transition-transform duration-300 group-hover/logo:scale-110"
        onError={(e) => { e.currentTarget.style.display = "none" }}
      />
    </div>
  );

  return (
    <section className="relative py-20 lg:py-28 bg-navy overflow-hidden">
      {/* Dark Theme Decorative Background */}
      <div className="absolute inset-0 bg-dot-grid opacity-10" />

      {/* Massive Faint Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none select-none">
        <span className="text-[16vw] md:text-[12vw] font-black text-white whitespace-nowrap tracking-tighter opacity-[0.06]">
          PARTNERS
        </span>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        <Reveal>
          {/* Dark Theme Header */}
          <div className="text-center mb-12">
            <h3 className="text-orange font-bold text-lg mb-2 uppercase tracking-widest">Building careers, shaping futures</h3>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Our Recruiting <span className="text-orange">Partners</span>
            </h2>
          </div>

          <div className="rounded-[32px] p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02]">
            {/* Enhanced Marquee Container */}
            <div className="relative flex overflow-hidden group mask-horizontal pb-4 -mb-4">
              <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
                {partners.map((partner: any, index: number) => renderTile(partner, `a-${index}`))}
              </div>

              {/* Duplicate for seamless loop */}
              <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]" aria-hidden="true">
                {partners.map((partner: any, index: number) => renderTile(partner, `b-${index}`))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-white">1000+</p>
                <p className="text-sm text-gray-400 font-medium mt-1">Placements</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-white">18+</p>
                <p className="text-sm text-gray-400 font-medium mt-1">Partner Companies</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-white">65+</p>
                <p className="text-sm text-gray-400 font-medium mt-1">Certified Teachers</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Placements;
