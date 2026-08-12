"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "@/styles/ncet/blogAnimations.css";

interface BlogNavigationProps {
  prevBlogId?: number | string | null;
  nextBlogId?: number | string | null;
}

const BlogNavigation: React.FC<BlogNavigationProps> = ({ prevBlogId, nextBlogId }) => {
  const router = useRouter();

  const handleNavigation = (blogId: string | number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(`/blog/${blogId}`);
  };

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 w-full">
      {/* Previous Blog Button */}
      <button
        type="button"
        disabled={!prevBlogId}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl border border-navy text-navy font-bold text-sm tracking-wider uppercase transition-all duration-300 ${
          !prevBlogId ? "pointer-events-none opacity-50" : "hover:bg-navy hover:text-white"
        }`}
        onClick={() => prevBlogId && handleNavigation(prevBlogId)}
      >
        <span className="blg-nudge-left">
          <ArrowLeft size={16} />
        </span>
        READ PREVIOUS BLOG
      </button>

      {/* Next Blog Button */}
      <button
        type="button"
        disabled={!nextBlogId}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-orange border border-orange text-white font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(246,135,42,0.3)] ${
          !nextBlogId
            ? "pointer-events-none opacity-50"
            : "hover:bg-orange/90 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(246,135,42,0.4)]"
        }`}
        onClick={() => nextBlogId && handleNavigation(nextBlogId)}
      >
        READ NEXT BLOG{" "}
        <span className="blg-nudge">
          <ArrowRight size={16} />
        </span>
      </button>
    </div>
  );
};

export default BlogNavigation;
