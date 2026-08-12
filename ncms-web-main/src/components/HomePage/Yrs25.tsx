"use client";
import React from "react";
import Reveal from "@/components/ui/Reveal";
import Kicker from "@/components/ui/Kicker";
import { Users, Award, TrendingUp, Star } from "lucide-react";

const Yrs25 = ({ data }: any) => {
  const heading = data?.heading || "25 Years of Excellence";
  const description = data?.description;

  const renderHeading = (text: string) => {
    if (text.includes("Excellence")) {
      const parts = text.split("Excellence");
      return (
        <>
          {parts[0]}
          <span className="text-orange">Excellence</span>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  const milestones = [
    { icon: Users, label: "Happy Alumni", value: "1500+" },
    { icon: Award, label: "Placements", value: "1000+" },
    { icon: TrendingUp, label: "Certified Teachers", value: "65+" },
    { icon: Star, label: "Approved Courses", value: "7+" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F8F9FB] py-20 lg:py-28" aria-labelledby="anniversary-title">
      {/* Subtle Dot Grids */}
      <div className="absolute top-12 right-12 opacity-40 pointer-events-none z-0">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dot-grid-yrs-1" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#CBD5E1" />
          </pattern>
          <rect x="0" y="0" width="60" height="60" fill="url(#dot-grid-yrs-1)" />
        </svg>
      </div>

      <div className="absolute bottom-16 left-16 opacity-50 pointer-events-none z-0">
        <svg width="96" height="60" viewBox="0 0 96 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dot-grid-yrs-2" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#94A3B8" />
          </pattern>
          <rect x="0" y="0" width="96" height="60" fill="url(#dot-grid-yrs-2)" />
        </svg>
      </div>

      {/* Subtle Geometric Shapes */}
      <div className="absolute -top-10 -left-10 w-[200px] h-[200px] bg-navy rounded-full pointer-events-none z-0" />
      <div className="absolute -bottom-16 -right-16 w-[250px] h-[250px] bg-[#EEF0F6] rounded-full pointer-events-none z-0" />

      {/* Orange Plus Signs */}
      <div className="absolute top-1/3 left-[20%] text-orange text-2xl font-bold opacity-60 pointer-events-none z-0">+</div>
      <div className="absolute bottom-1/4 right-[20%] text-orange text-2xl font-bold opacity-60 pointer-events-none z-0">+</div>

      <div className="container mx-auto px-4 lg:px-8 max-w-[1400px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal className="flex justify-center order-2 lg:order-1 relative z-20">
            <div className="group relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              {/* Animated Background Shapes */}
              <span className="absolute inset-[-8%] rounded-[40px] bg-gradient-to-br from-navy to-navy-dark rotate-[-12deg] shadow-[0_40px_100px_rgba(14,36,85,0.25)] transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:rotate-0" />
              <span className="absolute w-[88%] h-[88%] rounded-full border-[4px] border-white/60" />
              <div className="absolute w-[76%] h-[76%] rounded-full border-[2px] border-orange/30" />

              {/* Main Image */}
              <div className="relative w-[72%] aspect-square rounded-full overflow-hidden shadow-[0_30px_80px_rgba(14,36,85,0.35)] animate-float border-4 border-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/NGI_Front_9416f38b7b.jpeg" alt={heading} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_3px_rgba(255,255,255,0.3),inset_0_16px_40px_rgba(255,255,255,0.15)]" />
              </div>

              {/* Enhanced Floating Badge */}
              <div className="absolute -bottom-4 -left-4 md:-left-8 bg-white px-6 py-4 rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-4 z-20">
                <div className="w-14 h-14 bg-gradient-to-br from-orange to-orange-dark rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
                  25
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-semibold">Years of</span>
                  <span className="text-navy font-extrabold text-lg">Excellence</span>
                </div>
              </div>

              {/* Secondary Decorative Element */}
              <div className="absolute -top-6 right-0 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 animate-float z-20" style={{ animationDelay: "1.5s" }}>
                <Star className="text-orange" size={24} fill="currentColor" />
              </div>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2" delay={0.1}>
            <Kicker>Our Milestone</Kicker>
            <h2 id="anniversary-title" className="text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-[-0.5px] text-navy mt-4 mb-6">
              {renderHeading(heading)}
            </h2>
            <p className="text-lg text-body-gray leading-relaxed max-w-xl mb-10 whitespace-pre-line">{description}</p>

            {/* Milestone Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <div key={index} className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:border-orange/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center">
                        <Icon size={20} className="text-orange" />
                      </div>
                      <span className="text-2xl font-extrabold text-navy">{milestone.value}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">{milestone.label}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Yrs25;
