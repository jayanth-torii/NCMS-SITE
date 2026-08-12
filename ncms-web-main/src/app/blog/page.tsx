"use client";

import React, { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";

import BlogCards from "@/components/BlogsPage/BlogCard";
import Pagination from "@/components/BlogsPage/Pagination";
import PageBanner from "@/components/PageBanner/PageBanner";
import { decorateBlog } from "@/components/BlogsPage/blogMeta";

import blogData from "@/data-export/blog/data.json";
import { getBlogBanner, getBlogs } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";
import "@/styles/ncet/blogAnimations.css";

const BlogList = () => {
  const { data: liveBanner } = useLiveData(
    getBlogBanner,
    blogData?.BannerSection || null
  );
  const { data: liveBlogs } = useLiveData(getBlogs, []);

  const bannerSection = liveBanner || blogData?.BannerSection || null;

  const rawBlogs =
    liveBlogs && liveBlogs.length > 0 ? liveBlogs : blogData?.blogObject || [];
  const blogs = useMemo(() => rawBlogs.map(decorateBlog), [rawBlogs]);

  const articlesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(blogs.length / articlesPerPage);
  const startIndex = currentPage * articlesPerPage;
  const displayed = blogs.slice(startIndex, startIndex + articlesPerPage);

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col w-full overflow-hidden relative">
      <PageBanner
        eyebrow={bannerSection?.eyebrow || "Insights & Updates"}
        title={bannerSection?.title || "BLOG"}
        subtitle={
          bannerSection?.subtitle ||
          "Discover the latest news, ideas, and academic insights from Nagarjuna College of Management Studies."
        }
        image={
          bannerSection?.image || "/images/blogs_banner_a494e12d91.png"
        }
      />

      {/* Background Graphic: Giant Navy Circle with Orange Border */}
      <div className="absolute top-[-250px] left-[-150px] w-[500px] h-[500px] md:top-[-250px] md:left-[-150px] md:w-[600px] md:h-[600px] rounded-full z-0 overflow-hidden pointer-events-none transform -translate-x-1/3 -translate-y-1/3">
        <div className="absolute inset-0 bg-[#0e2455] rounded-full border-r-[32px] border-b-[16px] border-[#F6872A] opacity-100"></div>
      </div>

      {/* Background Graphic: Top Right Soft Orange Blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-[#F6872A]/10 rounded-[100px] blur-[120px] z-0 pointer-events-none transform translate-x-1/4 -translate-y-1/4"></div>

      {/* Background Graphic: Top Left Dot Grid */}
      <div className="absolute top-[120px] left-[10%] lg:left-[15%] opacity-20 pointer-events-none z-0 hidden md:block">
        <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dots-blog" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#F6872A" />
          </pattern>
          <rect width="80" height="80" fill="url(#dots-blog)" />
        </svg>
      </div>

      {/* Background Graphic: Right Architecture Building Sketch */}
      <div className="absolute top-[40px] right-[-5%] opacity-[0.04] pointer-events-none z-0 hidden xl:block w-[600px] h-[300px]">
        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M50 150 L50 50 L350 20 L350 150 M50 150 L350 150 M100 60 L100 150 M150 55 L150 150 M200 50 L200 150 M250 45 L250 150 M300 40 L300 150"
            stroke="#000"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M60 70 L90 70 L90 100 L60 100 Z M110 65 L140 65 L140 95 L110 95 Z M160 60 L190 60 L190 90 L160 90 Z M210 55 L240 55 L240 85 L210 85 Z M260 50 L290 50 L290 80 L260 80 Z M310 45 L340 45 L340 75 L310 75 Z"
            stroke="#000"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-16 lg:pt-20 pb-24">
        {/* Custom Header Section */}
        <header className="text-center mb-16 md:mb-20 max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-8 bg-[#F6872A] opacity-60"></div>
            <div className="flex items-center gap-2 text-[#F6872A] font-bold text-[12px] md:text-[13px] tracking-[0.2em] uppercase">
              <span className="blg-icon-float-sm">
                <BookOpen size={16} strokeWidth={2.5} />
              </span>
              <span>College Insights</span>
            </div>
            <div className="h-[2px] w-8 bg-[#F6872A] opacity-60"></div>
          </div>

          <h1 className="text-[48px] md:text-[64px] font-black tracking-tight mb-6 leading-[1.1]">
            <span className="text-[#0e2455]">News & </span>
            <span className="text-[#F6872A] relative inline-block">
              Insights
              <div className="absolute -bottom-1 left-0 w-full h-[6px] bg-[#F6872A] opacity-20 rounded-full"></div>
            </span>
          </h1>

          <p className="text-gray-600 font-medium text-[16px] md:text-[18px] leading-relaxed max-w-2xl">
            Stay updated with the latest stories, innovations, and achievements from
            Nagarjuna College of Management Studies.
          </p>
        </header>

        <BlogCards displayedArticles={displayed} startIndex={startIndex} />

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          articlesPerPage={articlesPerPage}
          totalArticles={blogs.length}
        />
      </div>
    </main>
  );
};

export default BlogList;
