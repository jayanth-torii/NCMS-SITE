"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, X, ChevronRight, LayoutGrid } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Kicker from "@/components/ui/Kicker";

export default function LifeAtNCMS({ data }: any) {
  const { Videos = [], title } = data || {};

  const [currentVideo, setCurrentVideo] = useState<string | undefined>(Videos?.[0]);
  const [videoOpen, setVideoOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const playVideo = (video?: string) => {
    if (!video) return;
    setCurrentVideo(video);
    setVideoOpen(true);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (Videos.length === 0) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth - 4
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
        }
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [Videos.length]);

  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVideoOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [videoOpen]);

  if (Videos.length === 0) return null;

  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* Decorative Background & Shapes */}
      <div className="absolute inset-0 bg-dot-grid opacity-[0.03] pointer-events-none z-0" />

      {/* Glowing Ambient Blobs */}
      <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-[#F6872A]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[500px] h-[500px] bg-[#1a3668]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="absolute top-[15%] left-[8%] opacity-30 pointer-events-none z-0 hidden lg:block animate-pulse">
        <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="#F6872A" strokeWidth="8" strokeDasharray="15 15" />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        {/* Row 1: Campus Life hero */}
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-center">
          {/* Left: copy */}
          <Reveal>
            <Kicker>Campus Life</Kicker>
            <h2 className="mt-5 text-navy font-extrabold text-[40px] sm:text-[48px] lg:text-[56px] leading-[1.05] tracking-[-1px]">
              {title || "Experience the Life at NCMS"}
            </h2>
            <p className="mt-6 text-body-gray text-[17px] leading-[1.7] max-w-md">
              Discover the vibrant campus life, academic excellence and endless opportunities that shape your future.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => playVideo(Videos?.[0])}
                className="inline-flex items-center gap-3 bg-navy text-white rounded-full pl-2.5 pr-6 py-2.5 font-bold text-[15px] transition-all duration-300 hover:bg-navy-dark hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15">
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                </span>
                Watch Campus Life
              </button>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-white border-2 border-orange/40 text-navy rounded-full px-6 py-3 font-bold text-[15px] transition-all duration-300 hover:border-orange hover:bg-orange/5"
              >
                <LayoutGrid size={16} className="text-orange" />
                Explore Gallery
              </Link>
            </div>
          </Reveal>

          {/* Right: framed video preview */}
          <Reveal delay={0.1} className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[440px] aspect-square mt-6">
              {/* Decorative ring */}
              <svg
                className="absolute -inset-5 md:-inset-7 w-[calc(100%+2.5rem)] h-[calc(100%+2.5rem)] md:w-[calc(100%+3.5rem)] md:h-[calc(100%+3.5rem)] pointer-events-none"
                viewBox="0 0 100 100"
                fill="none"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  stroke="#0e2455"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  strokeOpacity="0.25"
                  pathLength={100}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  stroke="#f6872a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="26 74"
                  pathLength={100}
                  transform="rotate(150 50 50)"
                />
              </svg>

              {/* Photo */}
              <div className="absolute inset-[7%] rounded-full overflow-hidden shadow-[0_30px_80px_rgba(14,36,85,0.25)] border-[6px] border-white bg-navy">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${Videos[0]}/hqdefault.jpg`}
                  alt="Campus life at NCMS"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>

              {/* Play button */}
              <button
                onClick={() => playVideo(Videos?.[0])}
                className="group absolute top-1/2 left-[16%] -translate-y-1/2 z-20 flex flex-col items-center gap-2"
                aria-label="Play campus life video"
              >
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/95 shadow-xl transition-transform duration-300 group-hover:scale-105">
                  <span className="flex items-center justify-center w-11 h-11 rounded-full bg-orange text-white">
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                  </span>
                </span>
                <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-navy shadow">
                  Play Video
                </span>
              </button>

              {/* Bottom-right program badge */}
              <div className="absolute bottom-3 right-0 sm:-right-6 z-20 rounded-2xl rounded-tl-none bg-navy px-5 py-3.5 shadow-xl">
                <p className="text-white font-extrabold text-lg leading-tight">NCMS</p>
                <p className="text-orange text-[11px] font-bold uppercase tracking-wide">Campus Life</p>
              </div>

              {/* Decorative dot */}
              <span className="absolute top-6 right-8 w-3 h-3 rounded-full border-2 border-orange" />
            </div>
          </Reveal>
        </div>

        {/* Row 2: Moments That Matter */}
        <div className="mt-28 lg:mt-32 flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          <Reveal className="lg:w-[300px] lg:shrink-0">
            <Kicker>Explore</Kicker>
            <h3 className="mt-4 text-navy font-extrabold text-[28px] sm:text-[32px] leading-[1.15]">
              Moments That Matter
            </h3>
            <p className="mt-4 text-body-gray text-[16px] leading-[1.7] max-w-xs">
              Relive the best moments from events, activities and student achievements.
            </p>
            <Link
              href="/gallery"
              className="mt-6 inline-flex w-fit items-center gap-2 whitespace-nowrap bg-white border-2 border-orange/40 text-navy rounded-full px-5 py-3 font-bold text-[14px] transition-all duration-300 hover:border-orange hover:bg-orange/5"
            >
              <LayoutGrid size={15} className="text-orange" />
              View All Gallery
            </Link>
          </Reveal>

          <Reveal delay={0.1} className="relative min-w-0 flex-1 w-full">
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1"
            >
              {(Videos || []).map((video: string, index: number) => {
                const isActive = video === currentVideo && videoOpen;
                return (
                  <button
                    key={`${video}-${index}`}
                    onClick={() => playVideo(video)}
                    aria-label={`Play campus life video ${index + 1}`}
                    className="group relative w-56 sm:w-64 flex-shrink-0 aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(14,36,85,0.14)]"
                  >
                    <span className="absolute top-3 left-3 z-20 rounded-lg bg-navy px-2.5 py-1 text-[11px] font-bold text-white">
                      #{index + 1}
                    </span>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${video}/hqdefault.jpg`}
                      alt={`Campus life video ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    <span
                      className={`absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${
                        isActive ? "bg-orange text-white" : "bg-white/90 text-navy group-hover:bg-orange group-hover:text-white"
                      }`}
                    >
                      <Play size={13} fill="currentColor" className="ml-0.5" />
                    </span>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent pt-12 pb-4 px-4">
                      <p className="text-white font-extrabold text-[13px] uppercase tracking-wide">
                        Campus Life {index + 1}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              className="hidden md:flex items-center justify-center absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-gray-200 text-navy shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:bg-navy hover:text-white z-10"
              onClick={() => scroll("right")}
              aria-label="Scroll gallery right"
            >
              <ChevronRight size={20} />
            </button>
          </Reveal>
        </div>
      </div>

      {/* Video Modal */}
      {videoOpen && currentVideo && (
        <div
          className="fixed inset-0 z-[999] bg-navy-dark/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1`}
              title="Campus life video"
              allow="autoplay; encrypted-media"
              frameBorder="0"
              allowFullScreen
            />
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-navy hover:bg-white transition-colors"
              aria-label="Close video"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
