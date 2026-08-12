import React from "react";
import BlogCard from "@/components/BlogsPage/ArticleCard";
import Reveal from "@/components/ui/Reveal";

const BlogCards = ({ displayedArticles, startIndex = 0 }: any) => {
  return (
    <Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10 mb-16">
        {displayedArticles.length > 0 ? (
          displayedArticles.map((article: any, i: number) => (
            <BlogCard key={article.id} article={article} index={startIndex + i} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No articles found.</p>
        )}
      </div>
    </Reveal>
  );
};

export default BlogCards;
