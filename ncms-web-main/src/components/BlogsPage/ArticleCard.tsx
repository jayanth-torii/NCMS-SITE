"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Cpu,
  FlaskConical,
  GraduationCap,
  MonitorPlay,
  Target,
  Users,
} from "lucide-react";
import { handleBlogImgError } from "@/components/BlogsPage/blogImg";
import "@/styles/ncet/blogAnimations.css";

const ICONS = [FlaskConical, Target, Cpu, MonitorPlay, GraduationCap, Users];

const BlogCard = ({ article, index = 0 }: { article: any; index?: number }) => {
  const Icon = ICONS[index % ICONS.length];
  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/blog/${article.id}`}
      className="group flex flex-col cursor-pointer bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative w-full h-[240px] xl:h-[260px] blg-img-shimmer overflow-hidden">
        <Image
          src={article.image || article.blogImage}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-[var(--ease-editorial)]"
          onError={handleBlogImgError}
        />

        {/* Number Badge */}
        <div className="absolute top-0 left-0 bg-[#F6872A] text-white rounded-br-[24px] px-6 py-2.5 font-black text-[14px] z-20 shadow-md">
          {formattedIndex}
        </div>

        {/* SVG Curve Overlay */}
        <svg
          className="absolute bottom-[-1px] left-0 w-full h-[60px] text-white fill-current pointer-events-none z-10 drop-shadow-[0_-5px_10px_rgba(0,0,0,0.02)]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,120 L1200,120 L1200,20 C800,140 0,0 0,0 Z"></path>
        </svg>

        {/* Floating Icon — gentle bob (staggered per card) + breathing ring */}
        <div className="absolute bottom-[20px] left-8 w-12 h-12 bg-[#F6872A] rounded-full flex items-center justify-center text-white z-20 shadow-lg blg-pulse-ring transform group-hover:scale-110 transition-transform duration-300 border-[3px] border-white">
          <span
            className="blg-icon-float"
            style={{ animationDelay: `${(index % 6) * 0.35}s` }}
          >
            <Icon size={20} strokeWidth={2.5} />
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-8 pt-4">
        <span className="text-[#F6872A] font-extrabold text-[10px] tracking-[0.2em] uppercase mb-2">
          Nagarjuna College of Management Studies
        </span>

        <h2 className="text-[20px] xl:text-[22px] font-extrabold text-[#0e2455] leading-snug mb-3 group-hover:text-[#F6872A] transition-colors duration-300 line-clamp-2 tracking-tight">
          {article.title}
        </h2>

        <p className="text-gray-500 text-[15px] leading-[1.7] mb-8 line-clamp-3">
          {article.description}
        </p>

        {/* Footer Row */}
        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#0e2455] font-extrabold text-[12px] tracking-widest uppercase group-hover:text-[#F6872A] transition-colors duration-300">
            Read Article
            <span className="blg-nudge">
              <ArrowRight
                size={16}
                strokeWidth={2.5}
                className="text-[#F6872A] group-hover:translate-x-1 transition-transform duration-300"
              />
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-[13px] font-semibold">
            <CalendarDays size={14} />
            {article.date || "Mar 18, 2025"}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
