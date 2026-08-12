import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "@/styles/ncet/blogAnimations.css";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  articlesPerPage: number;
  totalArticles: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  setCurrentPage,
  articlesPerPage,
  totalArticles,
}) => {
  if (totalArticles <= articlesPerPage) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full px-4">
      {/* Left Decorative Line */}
      <div className="hidden md:flex items-center gap-4 opacity-70">
        <div className="w-3.5 h-3.5 rounded-full border-[2.5px] border-[#F6872A]"></div>
        <div className="flex gap-2">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
        <div className="w-12 h-[2px] bg-gray-300"></div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={currentPage === 0}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
            scrollToTop();
          }}
          className="flex items-center gap-2 px-8 py-3.5 rounded-[20px] border-[2px] border-[#0e2455] text-[#0e2455] font-extrabold text-[12px] tracking-[0.15em] uppercase hover:bg-[#0e2455] hover:text-white transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
        >
          <span className="blg-nudge-left">
            <ChevronLeft size={18} strokeWidth={2.5} />
          </span>
          Previous
        </button>
        <button
          type="button"
          disabled={currentPage === totalPages - 1}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
            scrollToTop();
          }}
          className="flex items-center gap-2 px-10 py-3.5 rounded-[20px] bg-[#F6872A] border-[2px] border-[#F6872A] text-white font-extrabold text-[12px] tracking-[0.15em] uppercase hover:bg-[#e0751b] hover:border-[#e0751b] transition-all duration-300 shadow-[0_8px_20px_rgba(246,135,42,0.3)] disabled:opacity-40 disabled:pointer-events-none"
        >
          Next
          <span className="blg-nudge">
            <ChevronRight size={18} strokeWidth={2.5} />
          </span>
        </button>
      </div>

      {/* Right Decorative Line */}
      <div className="hidden md:flex items-center gap-4 opacity-70">
        <div className="w-12 h-[2px] bg-gray-300"></div>
        <div className="flex gap-2">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
        <div className="w-3.5 h-3.5 rounded-full border-[2.5px] border-[#F6872A]"></div>
      </div>
    </div>
  );
};

export default Pagination;
