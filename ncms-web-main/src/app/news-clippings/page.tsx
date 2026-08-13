"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Images, ChevronLeft, ChevronRight, X, ArrowRight } from "lucide-react";

import PageBanner from "@/components/PageBanner/PageBanner";
import highlight from "@/components/HomeNCET/highlight";

import newsClippingsData from "@/data-export/news-clippings/data.json";
import { getNewsClippings } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const Rise = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, transform: "translateY(26px)" }}
    whileInView={{ opacity: 1, transform: "translateY(0px)" }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, ease: EASE, delay }}
  >
    {children}
  </motion.div>
);

const NewsClippings = () => {
  const { data: liveData } = useLiveData(getNewsClippings, newsClippingsData as any);
  const d: any = liveData || (newsClippingsData as any).data || newsClippingsData;

  const banner = d?.BannerSection || {};
  const section = d?.News_Imges_Section || {};
  const newsItems: any[] = section?.News || [];

  const [activeImg, setActiveImg] = useState<{ item: number; img: number } | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  // Flatten all images with their item + index so lightbox nav is simple.
  const allImages = useMemo(() => {
    const list: { src: string; item: number; img: number }[] = [];
    newsItems.forEach((item, itemIdx) => {
      (item.images || []).forEach((src: string, imgIdx: number) => {
        list.push({ src, item: itemIdx, img: imgIdx });
      });
    });
    return list;
  }, [newsItems]);

  const activePos = useMemo(() => {
    if (!activeImg) return -1;
    return allImages.findIndex(
      (im) => im.item === activeImg.item && im.img === activeImg.img
    );
  }, [activeImg, allImages]);

  const closeLightbox = useCallback(() => setActiveImg(null), []);
  const prevImage = useCallback(() => {
    setActiveImg((cur) => {
      if (!cur) return cur;
      const pos = allImages.findIndex((im) => im.item === cur.item && im.img === cur.img);
      const next = (pos - 1 + allImages.length) % allImages.length;
      return { item: allImages[next].item, img: allImages[next].img };
    });
  }, [allImages]);
  const nextImage = useCallback(() => {
    setActiveImg((cur) => {
      if (!cur) return cur;
      const pos = allImages.findIndex((im) => im.item === cur.item && im.img === cur.img);
      const next = (pos + 1) % allImages.length;
      return { item: allImages[next].item, img: allImages[next].img };
    });
  }, [allImages]);

  useEffect(() => {
    if (!activeImg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeImg, closeLightbox, prevImage, nextImage]);

  const activeSrc = activePos >= 0 ? allImages[activePos]?.src : null;

  return (
    <main className="ncl-page">
      <PageBanner
        eyebrow="In The News"
        title={banner?.title || "News Coverage"}
        subtitle={section?.description || "Campus stories, achievements, and community initiatives covered by the press."}
        image={banner?.image || "/images/news_clippings_banner_91a5271416.png"}
      />

      {/* ---- Intro ---- */}
      <section className="ncl-intro">
        <div className="container">
          <Rise className="ncl-intro__inner">
            <span className="ncl-intro__eyebrow">
              <i /> Media Highlights
            </span>
            <h1 className="ncl-intro__title">
              {section?.title ? highlight(section.title, "Coverage") : "News Coverage"}
            </h1>
            {section?.description && <p className="ncl-intro__desc">{section.description}</p>}
          </Rise>
        </div>
      </section>

      {/* ---- News grid ---- */}
      <section className="ncl-grid">
        <div className="container">
          <div className="ncl-grid__cols">
            {newsItems.map((item: any, itemIdx: number) => {
              const imgs: string[] = item.images || [];
              const descs: string[] = item.descriptions || [];
              const isExpanded = expanded.has(itemIdx);
              const visibleDescs = isExpanded ? descs : descs.slice(0, 2);
              return (
                <Rise key={itemIdx} delay={(itemIdx % 3) * 0.06}>
                  <article className="ncl-card">
                    <div
                      className="ncl-card__stage"
                      onClick={() => imgs[0] && setActiveImg({ item: itemIdx, img: 0 })}
                    >
                      {imgs[0] && <img src={imgs[0]} alt={`News clip ${itemIdx + 1}`} />}
                      <span className="ncl-card__badge">
                        <Newspaper size={12} /> News
                      </span>
                      {imgs.length > 1 && (
                        <span className="ncl-card__count">
                          <Images size={13} /> {imgs.length}
                        </span>
                      )}
                    </div>

                    <div className="ncl-card__body">
                      {imgs.length > 1 && (
                        <div className="ncl-card__thumbs">
                          {imgs.map((src: string, i: number) => (
                            <button
                              key={i}
                              type="button"
                              aria-label={`View image ${i + 1}`}
                              onClick={() => setActiveImg({ item: itemIdx, img: i })}
                            >
                              <img src={src} alt={`Thumbnail ${i + 1}`} />
                            </button>
                          ))}
                        </div>
                      )}

                      {visibleDescs.map((desc: string, i: number) => (
                        <p className="ncl-card__desc" key={i}>
                          {desc}
                        </p>
                      ))}

                      {descs.length > 2 && (
                        <button
                          type="button"
                          className="ncl-card__more"
                          onClick={() =>
                            setExpanded((prev) => {
                              const next = new Set(prev);
                              if (next.has(itemIdx)) next.delete(itemIdx);
                              else next.add(itemIdx);
                              return next;
                            })
                          }
                        >
                          {isExpanded ? "Show less" : "Read more"}
                          <ArrowRight />
                        </button>
                      )}
                    </div>
                  </article>
                </Rise>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Lightbox ---- */}
      <AnimatePresence>
        {activeSrc && (
          <motion.div
            className="ncl-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
          >
            <button
              className="ncl-lightbox__close"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            {allImages.length > 1 && (
              <>
                <button
                  className="ncl-lightbox__nav ncl-lightbox__nav--prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  className="ncl-lightbox__nav ncl-lightbox__nav--next"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
            <div className="ncl-lightbox__stage" onClick={(e) => e.stopPropagation()}>
              <img src={activeSrc} alt="News clipping" />
            </div>
            <span className="ncl-lightbox__counter">
              {activePos + 1} / {allImages.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default NewsClippings;
