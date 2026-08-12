"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import Kicker from "@/components/ui/Kicker";
import { ArrowRight, Newspaper } from "lucide-react";

const ExploreBlogs = ({ data }: any) => {
  const { title, link, image } = data || {};
  const router = useRouter();

  if (!image) return null;

  return (
    <section className="relative py-20 lg:py-24 bg-white overflow-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-[#F6872A]/5 rounded-[100px] blur-[60px] pointer-events-none rotate-45" />
      <div className="absolute bottom-[20%] left-[-5%] w-[350px] h-[350px] bg-[#1a3668]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 max-w-[1300px] relative z-10">
        <Reveal>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center rounded-[40px] border border-card-border bg-white p-8 md:p-12 shadow-[var(--shadow-card)]">
            {/* Left: Image */}
            <div className="relative overflow-hidden rounded-3xl aspect-[16/10] group">
              <Image
                src={image}
                alt={title || "Explore Blogs"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-orange px-4 py-1.5 text-xs font-bold text-white shadow-md">
                <Newspaper size={14} />
                BLOG
              </span>
            </div>

            {/* Right: Content */}
            <div>
              <Kicker className="mb-5">From The Blog</Kicker>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a3668] tracking-tight mb-5">
                {title || (<>Explore <span className="text-orange">Blogs</span></>)}
              </h2>
              <p className="text-gray-500 font-medium text-[15px] max-w-xl leading-relaxed">
                Insights, stories, and updates on our latest initiatives, events, and impact — written by our faculty and students.
              </p>

              <button
                onClick={() => router.push(link || "/blog")}
                className="group relative z-20 inline-flex items-center bg-orange hover:bg-orange-dark text-white font-bold rounded-full transition-colors duration-300 shadow-md pr-2 pl-6 py-2 mt-8"
              >
                <span className="mr-4 text-[15px]">Read All Blogs</span>
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center transform group-hover:translate-x-1 transition-transform duration-300">
                  <ArrowRight size={18} />
                </div>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ExploreBlogs;
