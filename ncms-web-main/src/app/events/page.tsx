"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic2, Bus, Trophy, HeartHandshake, Music2, GraduationCap, Sparkles,
  ChevronDown, ChevronLeft, ChevronRight, X, Presentation,
} from "lucide-react";

import PageBanner from "@/components/PageBanner/PageBanner";
import highlight from "@/components/HomeNCET/highlight";

import eventsData from "@/data-export/event/data.json";
import { getEvents } from "@/services/data.service";
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

/* ---------------- icons per tab ---------------- */
const TAB_ICONS: Record<string, React.ReactNode> = {
  "Guest Lectures": <Mic2 />,
  "Industrial Visit": <Bus />,
  Sports: <Trophy />,
  NSS: <HeartHandshake />,
  "Cultural Events": <Music2 />,
  Conferences: <Presentation />,
  "Utkarsh 2k23": <Sparkles />,
};

/* ---------------- accordion item ---------------- */
const EvtAccordion = ({
  item,
  index,
  open,
  onToggle,
  onOpenImage,
}: {
  item: any;
  index: number;
  open: boolean;
  onToggle: () => void;
  onOpenImage: (src: string, group: string) => void;
}) => {
  const imgs: string[] = item?.images || [];
  const descs: string[] = item?.descriptions || [];

  return (
    <div className={`evt-acc${open ? " is-open" : ""}`}>
      <button type="button" className="evt-acc__head" onClick={onToggle}>
        <span className="evt-acc__num">{String(index + 1).padStart(2, "0")}</span>
        <span className="evt-acc__title">{item?.title}</span>
        <span className="evt-acc__chevron">
          <ChevronDown />
        </span>
      </button>
      {open && (
        <div className="evt-acc__body">
          {descs.map((d: string, i: number) => (
            <p className="evt-acc__desc" key={i}>
              {d}
            </p>
          ))}
          {imgs.length > 0 && (
            <div className={`evt-strip${imgs.length === 1 ? " evt-strip--single" : ""}`}>
              {imgs.map((src: string, i: number) => (
                <button
                  key={i}
                  type="button"
                  className="evt-strip__item"
                  onClick={() => onOpenImage(src, `evt-${index}`)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt={`${item?.title} ${i + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Events = () => {
  const { data: liveData } = useLiveData(getEvents, eventsData as any);
  const d: any = liveData || (eventsData as any).data || eventsData;

  const banner = d?.BannerSection || {};
  const tabs = [
    { id: "guestLecturesData", label: "Guest Lectures" },
    { id: "industrialVisitData", label: "Industrial Visit" },
    { id: "sportsData", label: "Sports" },
    { id: "NSSData", label: "NSS" },
    { id: "culturalEventsData", label: "Cultural Events" },
    { id: "conferenceSection", label: "Conferences" },
    { id: "Utkarsh", label: "Utkarsh 2k23" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [openAcc, setOpenAcc] = useState<Set<number>>(new Set());
  const [confTab, setConfTab] = useState("");
  const [lightbox, setLightbox] = useState<{ src: string; group: string } | null>(null);

  const toggleAcc = (idx: number) =>
    setOpenAcc((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });

  const openImage = useCallback((src: string, group: string) => setLightbox({ src, group }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const accordionData = d?.[activeTab];
  const accordionItems: any[] = accordionData?.accordionItem || [];

  const conf = d?.conferenceSection || {};
  const confSections: any[] = conf?.National_Conference?.Sections || [];
  const programs: any[] = conf?.Programs_Sections || [];
  useEffect(() => {
    if (activeTab === "conferenceSection" && confSections.length && !confTab) {
      setConfTab(confSections[0].TabName);
    }
  }, [activeTab, confSections, confTab]);
  const currentConf = confSections.find((s: any) => s?.TabName === confTab) || confSections[0];

  const utkarsh = d?.Utkarsh || {};

  // Lightbox flat image list for the active group (prev/next within group)
  const groupImages = useMemo(() => {
    const list: { src: string; group: string }[] = [];
    const push = (group: string, imgs: string[]) =>
      (imgs || []).forEach((src: string) => list.push({ src, group }));
    // event accordion groups
    ["guestLecturesData", "industrialVisitData", "sportsData", "NSSData", "culturalEventsData"].forEach((key) => {
      ((d?.[key]?.accordionItem) || []).forEach((it: any, idx: number) => push(`evt-${idx}`, it.images));
    });
    // conference national sections
    (confSections || []).forEach((s: any, idx: number) => push(`conf-${idx}`, s.images));
    // conference programs
    (programs || []).forEach((p: any, idx: number) => push(`prog-${idx}`, p.images));
    return list;
  }, [d, confSections, programs]);

  const activePos = lightbox
    ? groupImages.findIndex((im) => im.src === lightbox.src && im.group === lightbox.group)
    : -1;

  const prevImage = useCallback(() => {
    setLightbox((cur) => {
      if (!cur) return cur;
      const pos = groupImages.findIndex((im) => im.src === cur.src && im.group === cur.group);
      const next = (pos - 1 + groupImages.length) % groupImages.length;
      return { src: groupImages[next].src, group: groupImages[next].group };
    });
  }, [groupImages]);

  const nextImage = useCallback(() => {
    setLightbox((cur) => {
      if (!cur) return cur;
      const pos = groupImages.findIndex((im) => im.src === cur.src && im.group === cur.group);
      const next = (pos + 1) % groupImages.length;
      return { src: groupImages[next].src, group: groupImages[next].group };
    });
  }, [groupImages]);

  useEffect(() => {
    if (!lightbox) return;
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
  }, [lightbox, closeLightbox, prevImage, nextImage]);

  const renderPanel = () => {
    if (activeTab === "conferenceSection") {
      return (
        <div className="evt-panel">
          <h2 className="evt-panel__title">{conf?.title || "Conferences"}</h2>

          <div className="evt-conf-intro">
            <span className="evt-conf-intro__eyebrow">Academic Gatherings</span>
            <h3 className="evt-conf-intro__title">
              {conf?.National_Conference?.title || "National Conference"}
            </h3>
            {(conf?.description || []).map((desc: string, i: number) => (
              <p className="evt-conf-intro__desc" key={i}>
                {desc}
              </p>
            ))}
          </div>

          {confSections.length > 0 && (
            <>
              <div className="evt-subtabs">
                {confSections.map((s: any) => (
                  <button
                    key={s?.TabName}
                    type="button"
                    className={`evt-subtabs__btn${confTab === s?.TabName ? " is-active" : ""}`}
                    onClick={() => setConfTab(s?.TabName)}
                  >
                    {s?.TabName}
                  </button>
                ))}
              </div>
              {currentConf && (
                <div className="rounded-2xl border border-[#eef1f6] bg-white p-6 md:p-8 shadow-[0_10px_26px_rgba(14,36,85,0.05)]">
                  {currentConf?.description && (
                    <p className="text-[#53545b] text-sm leading-[1.8] text-justify mb-4">
                      {currentConf.description}
                    </p>
                  )}
                  {(currentConf?.images || []).length > 0 && (
                    <div
                      className={`evt-strip${
                        (currentConf.images || []).length === 1 ? " evt-strip--single" : ""
                      }`}
                    >
                      {(currentConf.images || []).map((src: string, i: number) => {
                        const idx = confSections.findIndex((s: any) => s?.TabName === confTab);
                        return (
                          <button
                            key={i}
                            type="button"
                            className="evt-strip__item"
                            onClick={() => openImage(src, `conf-${idx === -1 ? 0 : idx}`)}
                            aria-label={`View image ${i + 1}`}
                          >
                            <img src={src} alt={`${currentConf?.TabName} ${i + 1}`} loading="lazy" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {conf?.UTube_Link && (
            <div className="evt-video">
              <iframe
                src={`https://www.youtube.com/embed/${conf.UTube_Link}`}
                title="Conference Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {programs.length > 0 && (
            <div className="mt-10">
              {programs.map((p: any, i: number) => (
                <Rise key={p?.id || i} delay={(i % 3) * 0.05}>
                  <div className="evt-prog">
                    <div className="evt-prog__head">
                      <GraduationCap />
                      <h3 className="evt-prog__title">{p?.Program_title}</h3>
                    </div>
                    {(p?.descriptions || []).map((desc: string, j: number) => (
                      <p className="evt-prog__desc" key={j}>
                        {desc}
                      </p>
                    ))}
                    {(p?.images || []).length > 0 && (
                      <div
                        className={`evt-strip${(p.images || []).length === 1 ? " evt-strip--single" : ""}`}
                      >
                        {(p.images || []).map((src: string, j: number) => (
                          <button
                            key={j}
                            type="button"
                            className="evt-strip__item"
                            onClick={() => openImage(src, `prog-${i}`)}
                            aria-label={`View image ${j + 1}`}
                          >
                            <img src={src} alt={`${p?.Program_title} ${j + 1}`} loading="lazy" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Rise>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "Utkarsh") {
      return (
        <div className="evt-panel">
          <h2 className="evt-panel__title">{utkarsh?.title || "Utkarsh 2k23"}</h2>
          <div className="rounded-2xl border border-[#eef1f6] bg-white p-6 md:p-8 shadow-[0_10px_26px_rgba(14,36,85,0.05)]">
            {(utkarsh?.Content || []).map((c: string, i: number) => (
              <p className="text-[#53545b] text-sm leading-[1.8] text-justify mb-3" key={i}>
                {c}
              </p>
            ))}
          </div>
          {utkarsh?.UTube_Link && (
            <div className="evt-video">
              <iframe
                src={`https://www.youtube.com/embed/${utkarsh.UTube_Link}`}
                title="Utkarsh Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      );
    }

    // Accordion-based tabs
    if (!accordionItems.length) {
      return (
        <div className="evt-panel text-center py-16 text-[#64748b]">
          No {accordionData?.title || "events"} available yet.
        </div>
      );
    }

    return (
      <div className="evt-panel">
        <h2 className="evt-panel__title">{accordionData?.title}</h2>
        {accordionItems.map((item: any, i: number) => (
          <Rise key={item?.id || i} delay={(i % 4) * 0.04}>
            <EvtAccordion
              item={item}
              index={i}
              open={openAcc.has(i)}
              onToggle={() => toggleAcc(i)}
              onOpenImage={openImage}
            />
          </Rise>
        ))}
      </div>
    );
  };

  return (
    <main className="evt-page">
      <PageBanner
        eyebrow="Campus Life"
        title={banner?.title || "Events"}
        subtitle="Guest lectures, industrial visits, sports, NSS drives, cultural celebrations, conferences and more — the story of NCMS campus life."
        image={banner?.image || "/images/events_banner_687e52de91.png"}
      />

      <section className="evt-main">
        <div className="container">
          <Rise className="evt-intro">
            <span className="evt-intro__eyebrow">
              <i /> Happening at NCMS
            </span>
            <h1 className="evt-intro__title">
              {highlight("Events & Celebrations", "Events")}
            </h1>
            <p className="evt-intro__desc">
              Explore the vibrant calendar of academic and extracurricular activities that
              make the NCMS campus come alive.
            </p>
          </Rise>

          <Rise className="evt-tabs" delay={0.08}>
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`evt-tab${activeTab === t.id ? " is-active" : ""}`}
                onClick={() => {
                  setActiveTab(t.id);
                  setOpenAcc(new Set());
                }}
              >
                {TAB_ICONS[t.label]}
                {t.label}
              </button>
            ))}
          </Rise>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, transform: "translateY(14px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transform: "translateY(-8px)" }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {renderPanel()}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ---- Lightbox ---- */}
      <AnimatePresence>
        {lightbox && activePos >= 0 && (
          <motion.div
            className="evt-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
          >
            <button className="evt-lightbox__close" onClick={closeLightbox} aria-label="Close">
              <X size={20} />
            </button>
            {groupImages.length > 1 && (
              <>
                <button
                  className="evt-lightbox__nav evt-lightbox__nav--prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  className="evt-lightbox__nav evt-lightbox__nav--next"
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
            <div className="evt-lightbox__stage" onClick={(e) => e.stopPropagation()}>
              <img src={groupImages[activePos].src} alt="Event photo" />
            </div>
            <span className="evt-lightbox__counter">
              {activePos + 1} / {groupImages.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Events;
