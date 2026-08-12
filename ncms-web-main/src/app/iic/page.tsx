"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import PageBanner from "@/components/PageBanner/PageBanner";
import highlight from "@/components/HomeNCET/highlight";

import IICData from "@/data-export/iic/data.json";
import { getIic } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const containerV = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemV = {
  hidden: { opacity: 0, transform: "translateY(20px)" },
  show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.45, ease: EASE } },
};
const Rise = ({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <motion.div
    className={className}
    style={style}
    initial={{ opacity: 0, transform: "translateY(26px)" }}
    whileInView={{ opacity: 1, transform: "translateY(0px)" }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, ease: EASE }}
  >
    {children}
  </motion.div>
);

/* ---------------- icons ---------------- */
const sp = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const STAT_ICONS: Record<string, React.ReactNode> = {
  innovators: (<svg {...sp}><circle cx="9" cy="8" r="3.1" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M16 6.2a3 3 0 0 1 0 5.6" /><path d="M17 14.4A5.5 5.5 0 0 1 20.5 19" /></svg>),
  ideas: (<svg {...sp}><path d="M5 15c-1.5 1-2 5-2 5s4-.5 5-2a2.1 2.1 0 0 0-3-3Z" /><path d="M9 14c5-2 9-7 9-11 0 0-6 0-11 5-2 2-2 4-2 4l4 4s2 0 4-2Z" /><circle cx="14.5" cy="8.5" r="1.3" /></svg>),
  events: (<svg {...sp}><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></svg>),
};
const FUNC_ICONS: Record<string, React.ReactNode> = {
  culture: (<svg {...sp}><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>),
  programs: (<svg {...sp}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4M8 9h8M8 12.5h5" /></svg>),
  prototype: (<svg {...sp}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m12 12 8-4.5M12 12v9M12 12 4 7.5" /></svg>),
  ecosystem: (<svg {...sp}><circle cx="6" cy="7" r="2.4" /><circle cx="18" cy="7" r="2.4" /><circle cx="12" cy="18" r="2.4" /><path d="M7.6 8.8 10.6 16M16.4 8.8 13.4 16M8 7h8" /></svg>),
  startups: (<svg {...sp}><path d="M5 15c-1.5 1-2 5-2 5s4-.5 5-2a2.1 2.1 0 0 0-3-3Z" /><path d="M9 14c5-2 9-7 9-11 0 0-6 0-11 5-2 2-2 4-2 4l4 4s2 0 4-2Z" /></svg>),
  recognition: (<svg {...sp}><circle cx="12" cy="9" r="5" /><path d="m8.5 13-1.5 8 5-3 5 3-1.5-8" /></svg>),
};
const FOCUS_ICONS: React.ReactNode[] = [
  (<svg {...sp}><circle cx="6" cy="7" r="2.2" /><circle cx="18" cy="7" r="2.2" /><circle cx="12" cy="18" r="2.2" /><path d="M7.6 8.6 10.8 15.8M16.4 8.6 13.2 15.8M8 7h8" /></svg>),
  (<svg {...sp}><path d="M5 15c-1.5 1-2 5-2 5s4-.5 5-2a2.1 2.1 0 0 0-3-3Z" /><path d="M9 14c5-2 9-7 9-11 0 0-6 0-11 5-2 2-2 4-2 4l4 4s2 0 4-2Z" /><circle cx="14.5" cy="8.5" r="1.2" /></svg>),
  (<svg {...sp}><circle cx="12" cy="9" r="5" /><path d="m8.5 13-1.5 8 5-3 5 3-1.5-8" /></svg>),
  (<svg {...sp}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.3 1 2.5h6c0-1.2.2-1.7 1-2.5A6 6 0 0 0 12 3Z" /></svg>),
  (<svg {...sp}><path d="M9.5 4A2.5 2.5 0 0 0 7 6.5 2.5 2.5 0 0 0 5 11a2.5 2.5 0 0 0 2 4 2 2 0 0 0 4 0V4.5A2 2 0 0 0 9.5 4Z" /><path d="M14.5 4A2.5 2.5 0 0 1 17 6.5 2.5 2.5 0 0 1 19 11a2.5 2.5 0 0 1-2 4 2 2 0 0 1-4 0" /></svg>),
];
const IconExternal = (<svg {...sp}><path d="M5 12h13M12 6l6 6-6 6" /></svg>);
const IconArrow = (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
const Chevron = ({ dir }: { dir: "prev" | "next" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
  </svg>
);

/* ---------------- helpers ---------------- */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const initials = (name = "") => {
  const w = name.replace(/^(Dr|Prof|Mr|Mrs|Ms|Sri|Smt)\.?\s+/i, "").trim().split(/\s+/);
  return ((w[0]?.[0] || "") + (w[1]?.[0] || "")).toUpperCase() || "N";
};

const SectionHead = ({ eyebrow, heading, hl, onDark = false, center = true }: { eyebrow: string; heading: string; hl?: string; onDark?: boolean; center?: boolean }) => (
  <div className={`iix-head${center ? " iix-head--center" : ""}`}>
    <span className={`eyebrow-ed${onDark ? " eyebrow-ed--on-dark" : ""}`}>{eyebrow}</span>
    <h2 className={`heading-ed${onDark ? " heading-ed--on-dark" : ""}`}>{hl ? highlight(heading, hl) : heading}</h2>
  </div>
);

const IIC = () => {
  const { data: liveData } = useLiveData(getIic, IICData as any);
  const d: any = liveData || (IICData as any).data || IICData;

  const [activeAct, setActiveAct] = useState<string | null>(null);
  const [activeMem, setActiveMem] = useState<string | null>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const aboutSections = d?.AboutVisionMissionSections || {};
  const about = aboutSections.AboutSection || {};
  const visionMission = aboutSections.VisionMission || {};
  const accordions = aboutSections.AccordionSections || [];

  const activities = d?.activitiesSection || {};
  const members = d?.IICmembersSection || {};
  const certificate = d?.certificateSection || {};
  const appreciation = d?.AppreciationSection || {};
  const certImgCount = [certificate.certificateImage, appreciation.certificateImage].filter(Boolean).length;

  // Build derived models from NCMS data shape.
  const aboutText = about.descriptions?.[0] || "";
  const focusTitle = visionMission.title || "Our Vision & Mission";
  const focus = useMemo(() => {
    const items: string[] = [];
    (visionMission.sections || []).forEach((s: any) => {
      if (s.description) items.push(s.description);
      (s.points || []).forEach((p: string) => items.push(p));
    });
    return items;
  }, [visionMission]);

  // Stats derived from real data.
  const stats = useMemo(() => {
    const acts = Object.values(activities.activitiesData || {}).reduce((n: number, arr: any) => n + (arr?.length || 0), 0);
    const mems = Object.values(members.tabs || {}).reduce((n: number, arr: any) => n + (arr?.length || 0), 0);
    const obj = accordions.reduce((n: number, a: any) => n + (a.points?.length || 0), 0);
    return [
      { icon: "innovators", value: String(mems), label: "IIC Members" },
      { icon: "events", value: String(acts), label: "Activities Conducted" },
      { icon: "ideas", value: String(obj), label: "Key Objectives" },
    ];
  }, [activities, members, accordions]);

  // Functions derived from Objectives accordion.
  const functions = useMemo(() => {
    const out: { icon: string; tone: string; title: string; text: string }[] = [];
    const tones = ["navy", "orange", "blue"];
    const icons = ["culture", "programs", "prototype", "ecosystem", "startups", "recognition"];
    let i = 0;
    accordions.forEach((a: any) => {
      (a.points || []).forEach((p: string) => {
        const [title, ...rest] = p.split(":");
        out.push({
          icon: icons[i % icons.length],
          tone: tones[i % tones.length],
          title: (title || "").trim(),
          text: (rest.join(":") || "").trim(),
        });
        i++;
      });
    });
    return out;
  }, [accordions]);

  const activityTabs = useMemo(
    () => activities.tabs || Object.keys(activities.activitiesData || {}),
    [activities]
  );
  useEffect(() => {
    if (!activeAct && activityTabs.length) setActiveAct(activityTabs[0]);
  }, [activityTabs, activeAct]);
  useEffect(() => { setShowAllEvents(false); }, [activeAct]);

  const memberTabs = Object.keys(members.tabs || {});
  useEffect(() => {
    if (!activeMem && memberTabs.length) setActiveMem(memberTabs[0]);
  }, [memberTabs, activeMem]);

  const allEvents = (activities.activitiesData || {})[activeAct || ""] || [];
  const EVENTS_INITIAL = 5;
  const events = showAllEvents ? allEvents : allEvents.slice(0, EVENTS_INITIAL);
  const memberRows = (members.tabs || {})[activeMem || ""] || [];

  // Parse date "DD-MM-YYYY" from a title like "01- A Robotic Workshop (26-11-2023)".
  const parseDate = (title = "") => {
    const m = title.match(/\((\d{1,2})-(\d{1,2})-(\d{4})\)/);
    if (m) return { day: m[1].padStart(2, "0"), month: MONTHS[(parseInt(m[2], 10) || 1) - 1] || "" };
    return { day: "", month: "" };
  };
  const categoryOf = (title = "") => {
    const t = title.toLowerCase();
    if (/workshop|boot-?camp/.test(t)) return { label: "Workshop", tone: "orange" };
    if (/session/.test(t)) return { label: "Session", tone: "blue" };
    if (/competition|jam|debate|contest|expo|celebration|day/.test(t)) return { label: "Event", tone: "navy" };
    return { label: "Activity", tone: "navy" };
  };

  return (
    <div className="iix-page">
      <PageBanner
        className="iix-banner"
        title="Institution's Innovation Council"
        eyebrow="Innovation · Entrepreneurship"
        subtitle={aboutText || "Cultivating innovation, entrepreneurship and a culture of creativity at Nagarjuna College of Management Studies."}
        image={d?.banner?.image}
      />

      {/* ---- About + Focus ---- */}
      <section className="iix-sec iix-about-sec">
        <div className="container">
          <div className="iix-about__grid">
            <Rise className="iix-about__left">
              <span className="eyebrow-ed">{about.title || "About IIC"}</span>
              <h2 className="heading-ed iix-about__heading">{highlight(about.title || "About IIC", "IIC")}</h2>
              <p className="iix-about__text">{aboutText}</p>
              <div className="iix-stats">
                {stats.map((s, i) => (
                  <div className="iix-stat" key={i}>
                    <span className="iix-stat__ic">{STAT_ICONS[s.icon]}</span>
                    <span className="iix-stat__num">{s.value}</span>
                    <span className="iix-stat__label">{s.label}</span>
                  </div>
                ))}
              </div>
            </Rise>

            <Rise className="iix-focus">
              <span className="iix-focus__eyebrow">{focusTitle}</span>
              <ul className="iix-focus__list">
                {focus.map((f, i) => (
                  <li className="iix-focus__item" key={i}>
                    <span className="iix-focus__ic">{FOCUS_ICONS[i % FOCUS_ICONS.length]}</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <span className="iix-focus__dots" aria-hidden="true" />
            </Rise>
          </div>
        </div>
      </section>

      {/* ---- Functions ---- */}
      {functions.length > 0 && (
        <section className="iix-sec iix-funcs-sec">
          <div className="container">
            <Rise><SectionHead eyebrow="Key Mandates" heading="Functions of IIC" hl="IIC" /></Rise>
            <motion.div className="iix-funcs" variants={containerV} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
              {functions.map((fn, i) => (
                <motion.article className="iix-func" key={i} variants={itemV}>
                  <span className={`iix-func__icon iix-func__icon--${fn.tone}`}>{FUNC_ICONS[fn.icon]}</span>
                  <h3 className="iix-func__title">{fn.title}</h3>
                  <p className="iix-func__text">{fn.text}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ---- Activities ---- */}
      {activityTabs.length > 0 && (
        <section className="iix-sec iix-acts-sec">
          <div className="container">
            <Rise><SectionHead eyebrow="Events & Engagements" heading="IIC Activities" onDark /></Rise>
            <Rise>
              <div className="iix-tabs" role="tablist">
                {activityTabs.map((t: string) => (
                  <button key={t} type="button" role="tab" aria-selected={activeAct === t} className={`iix-tab${activeAct === t ? " is-active" : ""}`} onClick={() => setActiveAct(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </Rise>
            <Rise>
              <div className={`iix-events${showAllEvents ? " is-scroll" : ""}`}>
                {events.map((ev: any, i: number) => {
                  const { day, month } = parseDate(ev.title);
                  const cat = categoryOf(ev.title);
                  const tone = i % 2 ? "orange" : "navy";
                  const link = ev.instaGramLink || ev.faceBookLink;
                  return (
                    <article className="iix-event" key={i}>
                      <div className="iix-event__top">
                        {day ? (
                          <span className={`iix-event__date iix-event__date--${tone}`}>
                            <strong>{day}</strong><small>{month}</small>
                          </span>
                        ) : (
                          <span className={`iix-event__date iix-event__date--${tone}`}>
                            <strong>{String(i + 1).padStart(2, "0")}</strong><small>Event</small>
                          </span>
                        )}
                        <span className={`iix-event__tag iix-event__tag--${tone}`}>{cat.label}</span>
                      </div>
                      <h3 className="iix-event__title">{ev.title}</h3>
                      {link && (
                        <a className="iix-event__link" href={link} target="_blank" rel="noopener noreferrer">
                          View Details {IconExternal}
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            </Rise>
            {!showAllEvents && events.length > 1 && (
              <div className="iix-acts__rail" aria-hidden="true">
                <span className="iix-acts__line" />
                {events.map((_: any, i: number) => <span className="iix-acts__dot" key={i} />)}
              </div>
            )}
            {allEvents.length > EVENTS_INITIAL && (
              <div className="iix-acts__more">
                <button type="button" className="iix-acts__morebtn" onClick={() => setShowAllEvents((v) => !v)}>
                  {showAllEvents ? "Show Less" : "Explore More Activities"} {IconArrow}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---- Members ---- */}
      {memberTabs.length > 0 && (
        <section className="iix-sec iix-members-sec">
          <div className="container">
            <Rise><SectionHead eyebrow="Our Innovation Leaders" heading="IIC Members" /></Rise>
            <Rise>
              <div className="iix-tabs iix-tabs--light" role="tablist">
                {memberTabs.map((t: string) => (
                  <button key={t} type="button" role="tab" aria-selected={activeMem === t} className={`iix-tab iix-tab--light${activeMem === t ? " is-active" : ""}`} onClick={() => setActiveMem(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </Rise>
            <Rise className="iix-members__wrap">
              <button type="button" className="iix-mem-nav iix-mem-prev" aria-label="Previous"><Chevron dir="prev" /></button>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                observer={true}
                observeParents={true}
                navigation={{ prevEl: ".iix-mem-prev", nextEl: ".iix-mem-next" }}
                pagination={{ el: ".iix-mem-dots", clickable: true }}
                autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                loop={memberRows.length > 5}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 }, 1280: { slidesPerView: 5 } }}
              >
                {memberRows.map((m: any, i: number) => (
                  <SwiperSlide key={m.sn || i} style={{ height: "auto" }}>
                    <article className="iix-mcard">
                      <span className={`iix-mcard__avatar iix-mcard__avatar--${i % 2 ? "orange" : "navy"}`}>{initials(m.name)}</span>
                      <h3 className="iix-mcard__name">{m.name}</h3>
                      <p className="iix-mcard__desig">{m.designation}</p>
                      <span className={`iix-mcard__role iix-mcard__role--${i % 2 ? "orange" : "navy"}`}>{m.position}</span>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button type="button" className="iix-mem-nav iix-mem-next" aria-label="Next"><Chevron dir="next" /></button>
            </Rise>
            <div className="iix-mem-dots" />
          </div>
        </section>
      )}

      {/* ---- Certificates ---- */}
      {(certificate.certificateImage || appreciation.certificateImage) && (
        <section className="iix-sec iix-ed-sec">
          <div className="container">
            <Rise><SectionHead eyebrow="Recognition" heading="Certificates & Appreciation" hl="Certificates" /></Rise>
            <div className="iix-ed__vm" style={{ gridTemplateColumns: certImgCount > 1 ? "1fr 1fr" : "1fr" }}>
              {certificate.certificateImage && (
                <Rise className="iix-vm iix-vm--vision">
                  <span className="iix-vm__ic">{FUNC_ICONS.recognition}</span>
                  <div className="iix-vm__body">
                    <h3 className="iix-vm__title">{certificate.certificateTitle || certificate.title || "Certificate of Establishment"}</h3>
                    <p className="iix-vm__text" style={{ marginTop: 12 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={certificate.certificateImage} alt={certificate.certificateTitle || "Certificate"} loading="lazy" style={{ width: "100%", borderRadius: 12, boxShadow: "0 14px 32px rgba(14,36,85,0.12)" }} />
                    </p>
                  </div>
                </Rise>
              )}
              {appreciation.certificateImage && (
                <Rise className="iix-vm iix-vm--mission">
                  <span className="iix-vm__ic">{FUNC_ICONS.startups}</span>
                  <div className="iix-vm__body">
                    <h3 className="iix-vm__title">{appreciation.title || "Letter Of Appreciation"}</h3>
                    <p className="iix-vm__text" style={{ marginTop: 12 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={appreciation.certificateImage} alt={appreciation.title || "Appreciation"} loading="lazy" style={{ width: "100%", borderRadius: 12, boxShadow: "0 14px 32px rgba(14,36,85,0.12)" }} />
                    </p>
                  </div>
                </Rise>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default IIC;
