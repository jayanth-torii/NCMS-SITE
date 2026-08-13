"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import Kicker from "@/components/ui/Kicker";
import { ArrowRight, GraduationCap } from "lucide-react";

const Education = ({ educationProgrammes }: any) => {
  const data = educationProgrammes || {};
  const { heading, description, knowMoreText, image, buttons = [] } = data;
  const router = useRouter();

  const handleButton = (link: string) => {
    if (!link) return;
    if (link.startsWith("http")) {
      window.open(link, "_blank", "noopener noreferrer");
    } else {
      router.push(link);
    }
  };

  return (
    <section className="relative py-20 lg:py-28 bg-[#F8F9FB] overflow-hidden">
      {/* Subtle Dot Grids */}
      <div className="absolute top-16 left-1/4 opacity-40 pointer-events-none z-0">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dot-grid-edu-1" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#CBD5E1" />
          </pattern>
          <rect x="0" y="0" width="60" height="60" fill="url(#dot-grid-edu-1)" />
        </svg>
      </div>

      <div className="absolute bottom-16 right-16 opacity-50 pointer-events-none z-0">
        <svg width="96" height="60" viewBox="0 0 96 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dot-grid-edu-2" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#94A3B8" />
          </pattern>
          <rect x="0" y="0" width="96" height="60" fill="url(#dot-grid-edu-2)" />
        </svg>
      </div>

      {/* Subtle Geometric Shapes */}
      <div className="absolute -top-12 right-0 w-[250px] h-[250px] bg-[#EEF0F6] rounded-full pointer-events-none z-0 translate-x-1/3" />
      <div className="absolute -bottom-12 left-0 w-[200px] h-[200px] bg-navy rounded-full pointer-events-none z-0 -translate-x-1/2" />

      <div className="container mx-auto px-4 lg:px-8 max-w-[1400px] relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Enhanced Image Side - Left */}
          <Reveal className="w-full lg:w-1/2 flex justify-center relative z-20" delay={0.2}>
            <div className="relative w-full aspect-[4/3] max-w-[650px] group">
              {/* Animated Background Shapes */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-dark rounded-[40px] transform -rotate-6 scale-105 transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:-rotate-3 group-hover:scale-100" />
              <div className="absolute inset-0 bg-gradient-to-br from-orange to-orange-dark rounded-[40px] transform rotate-6 opacity-40 transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:rotate-3 group-hover:scale-100" />

              {/* Main Image Container */}
              <div className="relative w-full h-full rounded-[36px] overflow-hidden shadow-[0_40px_100px_rgba(14,36,85,0.2)] border-4 border-white z-10">
                {image && (
                  <Image
                    src={image}
                    alt="Education Programme"
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-float z-20">
                <div className="w-12 h-12 bg-gradient-to-br from-orange to-orange-dark rounded-xl flex items-center justify-center text-white">
                  <GraduationCap size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-semibold">UG &amp; PG</span>
                  <span className="text-navy font-extrabold text-lg">Programmes</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Enhanced Content Side - Right */}
          <Reveal className="w-full lg:w-1/2">
            <Kicker className="mb-6">Academic Programs</Kicker>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight leading-[1.1] mb-6">
              {heading}
            </h2>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              {description}
            </p>

            {knowMoreText && (
              <p className="text-navy font-bold text-xl mb-10">
                {knowMoreText}
              </p>
            )}

            {buttons?.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {buttons.map((btn: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleButton(btn.link)}
                    className="group flex items-center gap-3 bg-gradient-to-r from-navy to-navy-dark hover:from-orange hover:to-orange-dark border border-transparent text-white px-7 py-4 rounded-2xl transition-all duration-300 shadow-[0_12px_32px_rgba(14,36,85,0.25)] hover:shadow-[0_16px_40px_rgba(246,135,42,0.35)] hover:-translate-y-0.5 font-semibold"
                  >
                    {btn.text}
                    <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Education;
