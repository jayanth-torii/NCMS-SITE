"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight, MapPin, Award, Calendar } from "lucide-react";

const AboutNCMS = ({ data }: any) => {
  const { title, description, buttonText, image, link } = data || {};
  const router = useRouter();

  const renderTitle = (text: string) => {
    if (!text) return "Know About NCMS";
    const words = text.split(" ");
    if (words.length <= 1) return text;
    const lastWord = words.pop();
    return (
      <>
        {words.join(" ")} <span className="text-orange">{lastWord}</span>
      </>
    );
  };

  return (
    <section className="relative py-20 lg:py-32 bg-[#F8F9FB] overflow-hidden">
      {/* Subtle Dot Grids */}
      <div className="absolute top-12 left-12 opacity-40 pointer-events-none">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dot-grid-about-1" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#CBD5E1" />
          </pattern>
          <rect x="0" y="0" width="60" height="60" fill="url(#dot-grid-about-1)" />
        </svg>
      </div>

      <div className="absolute bottom-16 right-16 opacity-50 pointer-events-none z-0">
        <svg width="96" height="60" viewBox="0 0 96 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dot-grid-about-2" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#94A3B8" />
          </pattern>
          <rect x="0" y="0" width="96" height="60" fill="url(#dot-grid-about-2)" />
        </svg>
      </div>

      {/* Subtle Geometric Shapes */}
      <div className="absolute -top-10 -right-10 w-[250px] h-[250px] bg-[#EEF0F6] rounded-full pointer-events-none z-0" />
      <div className="absolute -bottom-16 -left-16 w-[200px] h-[200px] bg-navy rounded-full pointer-events-none z-0" />

      <div className="container mx-auto px-4 lg:px-8 max-w-[1400px] relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left: Image Side */}
          <Reveal className="w-full lg:w-1/2 flex justify-center relative mt-8 lg:mt-0" delay={0.1}>
            <div className="relative w-full max-w-[700px]">
              {/* Orange Semi-Circle Behind Image */}
              <div className="absolute -top-6 left-[25%] w-[100px] h-[50px] bg-orange rounded-t-full z-0 pointer-events-none" />

              {/* Main Image Container */}
              <div className="relative z-10 rounded-[32px] overflow-hidden shadow-xl border-[6px] border-white aspect-[16/9] w-full bg-gray-200">
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt={title || "About NCMS"} className="w-full h-full object-cover" />
                )}
              </div>

              {/* NGI Logo Block (Top Left Offset) */}
              <div className="absolute -top-6 -left-6 z-20 bg-navy rounded-3xl p-6 shadow-xl w-32 h-32 flex items-center justify-center border-4 border-[#F8F9FB]">
                <div className="text-center">
                  <div className="text-white font-black text-3xl leading-none tracking-tight">NGI</div>
                  <div className="text-white/80 text-[8px] font-semibold tracking-wider mt-1 uppercase leading-tight">
                    Nagarjuna<br />Group Of<br />Institutions
                  </div>
                </div>
              </div>

              {/* Floating Bottom Stats Bar */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20 w-[90%] bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] py-4 px-6 flex items-center justify-between border border-gray-50 max-sm:justify-center max-sm:gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center text-orange">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Established</div>
                    <div className="text-navy font-black text-sm">2015</div>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-100 mx-2 hidden sm:block" />
                <div className="flex items-center gap-3 hidden sm:flex">
                  <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center text-orange">
                    <Award size={18} />
                  </div>
                  <div className="text-navy font-bold text-sm leading-tight max-w-[110px]">
                    Affiliated to BNU
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-100 mx-2 hidden sm:block" />
                <div className="flex items-center gap-3 hidden sm:flex">
                  <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center text-orange">
                    <MapPin size={18} />
                  </div>
                  <div className="text-navy font-bold text-sm">Chikkaballapur</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: Content Side */}
          <Reveal className="w-full lg:w-1/2 lg:pl-10 mt-16 lg:mt-0" as="div">
            {/* Kicker with Line */}
            <div className="flex items-center gap-4 mb-4 relative z-20">
              <span className="text-sm font-bold text-orange tracking-widest uppercase">
                Welcome To NCMS
              </span>
              <div className="h-px bg-orange w-12 relative">
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange" />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-navy leading-[1.1] tracking-tight mb-8 relative z-20">
              {renderTitle(title)}
            </h2>

            <div className="relative">
              <div className="absolute top-0 right-1/4 -translate-y-1/4 z-0 opacity-40 pointer-events-none">
                <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="120" cy="120" r="119.5" stroke="#E2E8F0" strokeWidth="1" />
                  <circle cx="120" cy="120" r="90.5" stroke="#E2E8F0" strokeWidth="1" />
                  <circle cx="120" cy="120" r="60.5" stroke="#E2E8F0" strokeWidth="1" />
                  <circle cx="120" cy="120" r="30.5" stroke="#E2E8F0" strokeWidth="1" />
                </svg>
              </div>

              <div className="relative z-10 space-y-6 mb-10 text-gray-600 text-[16px] leading-[1.8] font-medium">
                {description?.map((text: any, index: any) => (
                  <p key={index}>{text}</p>
                ))}
              </div>
            </div>

            {/* Screenshot-Style Button */}
            <button
              onClick={() => router.push(link || "/about-ncms")}
              className="group relative z-20 inline-flex items-center bg-orange hover:bg-orange-dark text-white font-bold rounded-full transition-colors duration-300 shadow-md pr-2 pl-6 py-2 mt-4"
            >
              <span className="mr-4 text-[15px]">{buttonText || "Learn more about us"}</span>
              <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center transform group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRight size={18} />
              </div>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default AboutNCMS;
