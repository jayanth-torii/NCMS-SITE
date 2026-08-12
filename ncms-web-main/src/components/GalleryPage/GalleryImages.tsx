"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHOTOS_PER_ROW = 4;
const INITIAL_ROWS = 4;
const INITIAL_VISIBLE = PHOTOS_PER_ROW * INITIAL_ROWS;

const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8v-2a2 2 0 0 1 2 -2h2"></path>
    <path d="M4 16v2a2 2 0 0 0 2 2h2"></path>
    <path d="M16 4h2a2 2 0 0 1 2 2v2"></path>
    <path d="M16 20h2a2 2 0 0 0 2 -2v-2"></path>
  </svg>
);

const GalleryImages = ({ data }: any) => {
  // NCMS data shape: { "Campus Life": [...], "Activities": [...], ... }
  const categoriesData: Record<string, string[]> = data || {};
  const [activeTab, setActiveTab] = useState("All");
  const [popupIndex, setPopupIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const tabs = ["All", ...Object.keys(categoriesData)];
  const totalCount = Object.values(categoriesData).flat().length;

  const displayedImages = activeTab === "All"
    ? Object.values(categoriesData).flat()
    : (categoriesData[activeTab] || []);

  const visibleImages = displayedImages.slice(0, visibleCount);
  const canLoadMore = visibleCount < displayedImages.length;
  const canLoadLess = visibleCount > INITIAL_VISIBLE;

  const countFor = (tab: string) =>
    tab === "All" ? totalCount : (categoriesData[tab] || []).length;

  const selectTab = (tab: string) => {
    setPopupIndex(null);
    setActiveTab(tab);
    setVisibleCount(INITIAL_VISIBLE);
  };

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + INITIAL_VISIBLE, displayedImages.length));
  };

  const loadLess = () => {
    const nextCount = Math.max(INITIAL_VISIBLE, visibleCount - INITIAL_VISIBLE);
    setVisibleCount(nextCount);
    if (popupIndex !== null && popupIndex >= nextCount) {
      setPopupIndex(null);
    }
  };

  const closePopup = useCallback(() => setPopupIndex(null), []);
  const prevImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPopupIndex((prev) => (prev !== null ? (prev > 0 ? prev - 1 : visibleImages.length - 1) : prev));
  }, [visibleImages.length]);
  const nextImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPopupIndex((prev) => (prev !== null ? (prev < visibleImages.length - 1 ? prev + 1 : 0) : prev));
  }, [visibleImages.length]);

  // Keyboard navigation + lock body scroll while the lightbox is open
  useEffect(() => {
    if (popupIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [popupIndex, closePopup, prevImage, nextImage]);

  return (
    <>
      <div className="gallery-page">
        <div className="gallery-container">
          {/* Filter tabs */}
          <div className="gallery-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`gallery-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => selectTab(tab)}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="galleryTabBg"
                    className="gallery-tab__bg"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="gallery-tab__label">{tab}</span>
                <span className="gallery-tab__count">{countFor(tab)}</span>
              </button>
            ))}
          </div>

          {/* Image grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="gallery-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {visibleImages.map((src: string, index: number) => (
                <motion.button
                  type="button"
                  key={`${activeTab}-${index}`}
                  className="gallery-card"
                  onClick={() => setPopupIndex(index)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: (index % INITIAL_VISIBLE) * 0.03 }}
                >
                  <img src={src} alt={`Gallery ${index + 1}`} loading="lazy" />
                  <span className="gallery-card__overlay">
                    <span className="gallery-card__icon"><ExpandIcon /></span>
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>

          {(canLoadMore || canLoadLess) && (
            <div className="gallery-actions">
              {canLoadLess && (
                <button type="button" className="gallery-actions__btn gallery-actions__btn--secondary" onClick={loadLess}>
                  Load Less
                </button>
              )}
              {canLoadMore && (
                <button type="button" className="gallery-actions__btn gallery-actions__btn--primary" onClick={loadMore}>
                  Load More
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {popupIndex !== null && (
          <motion.div
            className="gallery-lightbox"
            onClick={closePopup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button className="gallery-lightbox__close" onClick={closePopup} aria-label="Close">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <button className="gallery-lightbox__nav gallery-lightbox__nav--prev" onClick={prevImage} aria-label="Previous image">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>

            <motion.div
              className="gallery-lightbox__stage"
              onClick={(e) => e.stopPropagation()}
              key={popupIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <img src={visibleImages[popupIndex]} alt="Gallery full view" />
            </motion.div>

            <button className="gallery-lightbox__nav gallery-lightbox__nav--next" onClick={nextImage} aria-label="Next image">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>

            <div className="gallery-lightbox__counter">
              {popupIndex + 1} / {visibleImages.length} <span>&bull;</span> {activeTab}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryImages;
