"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import BlogNavigation from "@/components/BlogsPage/BlogNavigation";
import PageBanner from "@/components/PageBanner/PageBanner";
import { decorateBlog } from "@/components/BlogsPage/blogMeta";
import { handleBlogImgError } from "@/components/BlogsPage/blogImg";

import blogData from "@/data-export/blog/data.json";
import { getBlogs } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";
import "@/styles/ncet/blogAnimations.css";

/**
 * Renders the CMS plain-text article as structured prose: ALL-CAPS short
 * blocks become section headings, everything else becomes a paragraph.
 */
function Prose({ content }: { content: string }) {
  const blocks = useMemo(() => {
    return content
      .split(/\n{2,}/)
      .map((b) => b.trim())
      .filter(Boolean);
  }, [content]);

  return (
    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
      {blocks.map((block, i) => {
        const isHeading =
          block.length <= 90 &&
          /^[A-Z0-9\s,!'&()\-:/]+$/.test(block) &&
          /[A-Z]{3,}/.test(block);
        if (isHeading) {
          return (
            <h2 key={i} className="text-[28px] md:text-[32px] font-extrabold text-navy mb-5 leading-tight tracking-tight">
              {block}
            </h2>
          );
        }
        return (
          <p key={i} className="mb-5 last:mb-0 text-[17px] text-[#2c3e50] leading-relaxed">
            {block.split(/\n/).map((line, j) => (
              <React.Fragment key={j}>
                {j > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

const BlogDetail = () => {
  const { id } = useParams();
  const idStr = String(id);

  const { data: liveBlogs } = useLiveData(getBlogs, []);
  // liveBlogs is the collection array (each doc has blogId/image/title/content);
  // static fallback is the exported blogObject keyed by numeric id.
  const rawBlogs =
    liveBlogs && liveBlogs.length > 0
      ? liveBlogs.map((b: any): any => ({ ...b, id: b.blogId, blogId: b.blogId }))
      : blogData?.blogObject || [];
  const blogs = useMemo(() => rawBlogs.map(decorateBlog), [rawBlogs]);

  const currentIndex = blogs.findIndex((b: any) => b.id.toString() === idStr);
  const blog = currentIndex >= 0 ? blogs[currentIndex] : null;

  const prevBlogId = currentIndex > 0 ? blogs[currentIndex - 1].id : null;
  const nextBlogId =
    currentIndex < blogs.length - 1 ? blogs[currentIndex + 1].id : null;
  const otherBlogs = blog
    ? blogs.filter((b: any) => b.id.toString() !== idStr).slice(0, 3)
    : [];

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center py-20 text-red-500 text-xl font-bold">
          Blog not found.
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] flex flex-col w-full overflow-hidden">
      <PageBanner
        eyebrow="Article"
        title={blog?.title}
        image={blog?.image || blog?.blogImage}
      />

      {/* Content Section */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-24 bg-white relative">
        {/* Subtle dot background */}
        <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 max-w-[1400px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Main Article Content */}
            <div className="lg:col-span-8">
              <Prose content={blog.content} />

              <div className="mt-16 pt-8 border-t border-gray-100/60">
                <BlogNavigation prevBlogId={prevBlogId} nextBlogId={nextBlogId} />
              </div>
            </div>

            {/* Sidebar: Related Blogs */}
            <div className="lg:col-span-4">
              <div className="sticky top-28">
                <h3 className="text-xl font-extrabold text-navy mb-8 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-orange rounded-full blg-pulse-ring"></span>
                  <span className="blg-icon-float-sm text-orange">
                    <BookOpen size={20} strokeWidth={2.5} />
                  </span>
                  Related Articles
                </h3>

                <div className="flex flex-col gap-5">
                  {otherBlogs.map((relatedItem: any) => (
                    <Link
                      href={`/blog/${relatedItem.id}`}
                      key={relatedItem.id}
                      className="group flex gap-5 bg-white p-4 rounded-[20px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] hover:border-orange/30 transition-all duration-300"
                    >
                      <div className="relative w-[110px] h-[110px] rounded-2xl overflow-hidden flex-shrink-0 blg-img-shimmer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={relatedItem.image || relatedItem.blogImage}
                          alt={relatedItem.title}
                          onError={handleBlogImgError}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center py-1">
                        <h4 className="font-extrabold text-navy text-[15px] leading-snug line-clamp-3 group-hover:text-orange transition-colors duration-300">
                          {relatedItem.title}
                        </h4>
                        <span className="text-[11px] text-orange font-extrabold mt-3 uppercase tracking-[0.1em] flex items-center gap-1.5">
                          Read More{" "}
                          <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                            →
                          </span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogDetail;
