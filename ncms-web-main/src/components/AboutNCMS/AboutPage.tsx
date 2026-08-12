"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaFileAlt,
  FaMapMarkerAlt,
  FaQuoteLeft,
} from "react-icons/fa";
import Reveal from "@/components/ui/Reveal";
import "./aboutNew.css";

const sp: React.SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const STAT_ICONS: Record<string, React.ReactNode> = {
  alumni: (
    <svg {...sp}>
      <circle cx="9" cy="8" r="3.1" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 6.2a3 3 0 0 1 0 5.6" />
      <path d="M17 14.4A5.5 5.5 0 0 1 20.5 19" />
    </svg>
  ),
  handshake: (
    <svg {...sp}>
      <path d="m11 17 2 2a1.5 1.5 0 0 0 2.1-2.1M13 15l2 2a1.5 1.5 0 0 0 2.1-2.1L13 10.5" />
      <path d="m18 14 2.5-2.5a2 2 0 0 0 0-2.8L17 5l-3 1" />
      <path d="M3.5 8.7 7 5l4 2-3 3a1.6 1.6 0 0 1-2.3 0l-.2-.2a1.6 1.6 0 0 1 0-2.3" />
      <path d="m9 19-2 2" />
    </svg>
  ),
  bulb: (
    <svg {...sp}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.3 1 2.5h6c0-1.2.2-1.7 1-2.5A6 6 0 0 0 12 3Z" />
    </svg>
  ),
  cap: (
    <svg {...sp}>
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1 2.7 2 6 2s6-1 6-2v-5" />
    </svg>
  ),
};

const IconTelescope = (
  <svg {...sp}>
    <path d="m11 15-3.5 5.5M14 14l2 6" />
    <path d="m4 11 14-7 2 4-14 7z" />
    <path d="m9 8 2 4" />
    <circle cx="11.5" cy="14" r="1.6" />
  </svg>
);
const IconFlag = (
  <svg {...sp}>
    <path d="M3 19.5h18" />
    <path d="m5 19.5 4.2-7.6 3.1 5.1" />
    <path d="m10.6 19.5 4.1-7.1 4.6 7.1" />
    <path d="M14.7 12.4V4.6" />
    <path d="M14.7 4.6 19 6 14.7 7.7Z" />
  </svg>
);

const LEGACY_ICONS: Record<string, React.ReactNode> = {
  quality: (
    <svg {...sp}>
      <path d="M12 3 4 6v5c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  industry: (
    <svg {...sp}>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12h18" />
    </svg>
  ),
  values: (
    <svg {...sp}>
      <path d="M12 21s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.7-7 10-7 10Z" />
    </svg>
  ),
};

const SectionHead = ({
  eyebrow,
  heading,
  sub,
  center = true,
}: {
  eyebrow?: string;
  heading: string;
  sub?: string;
  center?: boolean;
}) => (
  <div className={`abt-head${center ? " abt-head--center" : ""}`}>
    {eyebrow && <span className="eyebrow-ed">{eyebrow}</span>}
    <h2 className="heading-ed">{heading}</h2>
    {sub && <p className="abt-head__sub">{sub}</p>}
  </div>
);

const initials = (name = "") => {
  const w = name.replace(/^(Dr|Sri|Smt|Mr|Mrs|Ms|Prof)\.?\s+/i, "").trim().split(/\s+/);
  return ((w[0]?.[0] || "") + (w[1]?.[0] || "")).toUpperCase() || "A";
};

/* Count-up (IntersectionObserver + rAF) — same pattern as HomePage Stats */
function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { value, ref };
}

const StatCell = ({
  stat,
  iconKey,
}: {
  stat: { count: string; title: string; icon?: string };
  iconKey: string;
}) => {
  const numericPart = parseInt(
    String(stat.count ?? "0").replace(/,/g, "").match(/\d+/)?.[0] || "0",
    10
  );
  const suffix = String(stat.count ?? "").replace(/[0-9,]/g, "");
  const { value, ref } = useCountUp(numericPart);

  return (
    <div className="abt-impact__stat" ref={ref}>
      <span className="abt-impact__stat-ic">
        {stat.icon ? (
          <img src={stat.icon} alt="" className="abt-impact__stat-img" />
        ) : (
          STAT_ICONS[iconKey]
        )}
      </span>
      <span className="abt-impact__stat-num">
        {value}
        {suffix && <i>{suffix}</i>}
      </span>
      <span className="abt-impact__stat-label">{stat.title}</span>
    </div>
  );
};

type AboutPageProps = {
  aboutData: any;
  impactStats?: any[];
};

const AboutPage = ({ aboutData, impactStats = [] }: AboutPageProps) => {
  const [activeMgmt, setActiveMgmt] = useState(0);
  const [activeCampus, setActiveCampus] = useState(0);

  const legacy = aboutData?.AboutNGI;
  const leaders = aboutData?.Message_From_Leaders?.Leaders || [];
  const vmSections = aboutData?.AboutVisionMission?.Sections || [];
  const aboutDescriptions = aboutData?.AboutVisionMission?.Aboutdescriptions || [];
  const council = aboutData?.governingCouncil || [];
  const reports = aboutData?.Reports_And_Documentations;
  const campuses = aboutData?.ourCampus?.Campuses || [];

  // Robust selection by designation (not brittle index): Chairman/Director go
  // to the management desk; the Principal gets the dedicated message block.
  const mgmtCards = leaders.filter((l: any) =>
    /chairman|director|ceo/i.test(l.designation || "")
  );
  const principal = leaders.find((l: any) => /principal/i.test(l.designation || ""));

  const vision = vmSections.find((s: any) => /vision/i.test(s.title || ""));
  const mission = vmSections.find((s: any) => /mission/i.test(s.title || ""));

  // Short display role for the management-card overlay (NCET shows "Chairman").
  const shortRole = (designation = "") =>
    designation.split(/[,&]| of /i)[0]?.trim() || designation.split(",")[0]?.trim() || "";

  // Flatten report sections into carousel cards
  const docCards =
    reports?.sections?.flatMap((section: any) =>
      (section.files || []).map((file: any) => ({
        date: section.name,
        title: file.year,
        link: file.pdf,
      }))
    ) || [];

  const campus = campuses[activeCampus];

  const statIconKey = (title = "") => {
    if (/alumni/i.test(title)) return "alumni";
    if (/placement|partner|recruit/i.test(title)) return "handshake";
    if (/intake|student|learner/i.test(title)) return "cap";
    if (/course|program/i.test(title)) return "bulb";
    return "alumni";
  };

  return (
    <div className="abt-page">
      {/* ---- Our Legacy ---- */}
      <section className="abt-legacy">
        <span className="abt-legacy__accent" aria-hidden="true" />
        <span className="abt-legacy__dots" aria-hidden="true" />
        <div className="container mx-auto max-w-[1300px] px-4 lg:px-8">
          <div className="abt-legacy__grid">
            <Reveal className="abt-legacy__content">
              <span className="abt-legacy__eyebrow">Our Legacy</span>
              <h2 className="abt-legacy__title">
                <span className="abt-legacy__title-top">Nagarjuna</span>
                <span className="abt-legacy__title-bottom">Group of Institutions</span>
              </h2>
              <div className="abt-legacy__desc">
                {(legacy?.descriptions || []).slice(0, 2).map((d: string, i: number) => (
                  <p key={i}>{d}</p>
                ))}
              </div>
              <ul className="abt-legacy__features">
                {[
                  { icon: "quality", label: "Quality Education" },
                  { icon: "industry", label: "Industry Relevant" },
                  { icon: "values", label: "Values & Integrity" },
                ].map((f, i) => (
                  <li className="abt-legacy__feature" key={i}>
                    <span className="abt-legacy__feature-ic">{LEGACY_ICONS[f.icon]}</span>
                    {f.label}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="abt-legacy__media">
              <div className="abt-legacy__frame">
                <img src={legacy?.image} alt="Our Legacy" />
              </div>
              <div className="abt-legacy__badge">
                <span className="abt-legacy__badge-num">10+</span>
                <span className="abt-legacy__badge-text">Years of Academic Excellence</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Management Desk ---- */}
      <section className="abt-sec abt-mg-sec">
        <div className="container mx-auto max-w-[1300px] px-4 lg:px-8">
          <Reveal>
            <SectionHead
              center={false}
              eyebrow="Leadership"
              heading="From the Management Desk"
              sub="Guided by vision. Driven by values. Committed to excellence."
            />
          </Reveal>
          <Reveal>
            <div className="abt-mg__row" onMouseLeave={() => setActiveMgmt(0)}>
              {mgmtCards.map((c: any, idx: number) => {
                const active = idx === activeMgmt;
                return (
                  <article
                    key={c.name}
                    className={`abt-mg2${active ? " is-active" : ""}`}
                    onMouseEnter={() => setActiveMgmt(idx)}
                    onFocus={() => setActiveMgmt(idx)}
                    tabIndex={0}
                  >
                    <div className="abt-mg2__photo">
                      <img src={c.image} alt={c.name} />
                      <div className="abt-mg2__overlay">
                        <h3 className="abt-mg2__name">{c.name}</h3>
                        <span className="abt-mg2__role">{shortRole(c.designation)}</span>
                      </div>
                    </div>
                    <div className="abt-mg2__panel">
                      <div className="abt-mg2__panel-inner">
                        <span className="abt-mg2__qmark" aria-hidden="true">
                          <FaQuoteLeft />
                        </span>
                        <p className="abt-mg2__quote">
                          {(c.message || []).join(" ")}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Our Impact ---- */}
      <section className="abt-impact">
        <div className="container mx-auto max-w-[1300px] px-4 lg:px-8">
          <div className="abt-impact__grid">
            <Reveal className="abt-impact__intro">
              <span className="abt-impact__eyebrow">Our Impact</span>
              <h2 className="abt-impact__title">A Hub of Academic Excellence</h2>
              <p className="abt-impact__text">
                {aboutDescriptions[1] ||
                  "NCMS is known for providing excellent facilities and high-quality education, with a strong focus on skill enhancement and holistic development of students."}
              </p>
            </Reveal>
            <div className="abt-impact__stats">
              {impactStats.slice(0, 4).map((s, i) => (
                <StatCell key={i} stat={s} iconKey={statIconKey(s.title)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Vision & Mission + Principal ---- */}
      <section className="abt-sec abt-vm-sec">
        <div className="container mx-auto max-w-[1300px] px-4 lg:px-8 abt-container">
          <Reveal>
            <SectionHead eyebrow="Our Purpose" heading="Vision & Mission" />
          </Reveal>
          <Reveal>
            <div className="abt-vm__grid">
              <div className="abt-vm__card abt-vm__card--vision">
                <span className="abt-vm__icon">{IconTelescope}</span>
                <div className="abt-vm__body">
                  <h3 className="abt-vm__title">Vision</h3>
                  <p className="abt-vm__text">{vision?.description || "Leadership and Excellence in Education."}</p>
                </div>
              </div>
              <div className="abt-vm__card abt-vm__card--mission">
                <span className="abt-vm__icon">{IconFlag}</span>
                <div className="abt-vm__body">
                  <h3 className="abt-vm__title">Mission</h3>
                  <div className="abt-vm__text">
                    {(mission?.points?.length > 0 && (
                      <ul>
                        {mission.points.map((pt: string, i: number) => (
                          <li key={i}>{pt.replace(/\n/g, "").trim()}</li>
                        ))}
                      </ul>
                    )) || (
                      <p>
                        {mission?.description ||
                          "To empower students with the skills and values needed to shape the world."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
          {principal && (
            <Reveal>
              <div className="abt-pr">
                <div className="abt-pr__media">
                  <img src={principal.image} alt={principal.name} />
                </div>
                <div className="abt-pr__body">
                  <span className="abt-pr__eyebrow">Principal&apos;s Message</span>
                  <span className="abt-pr__quote-mark">
                    <FaQuoteLeft />
                  </span>
                  {(principal.message || []).map((para: string, i: number) => (
                    <p className="abt-pr__text" key={i}>
                      {para}
                    </p>
                  ))}
                  <p className="abt-pr__sign">
                    — {principal.name}
                    <span>{principal.designation}</span>
                  </p>
                </div>
                <span className="abt-pr__dots" aria-hidden="true" />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ---- Governing Council ---- */}
      <section className="abt-sec abt-co-sec">
        <div className="container mx-auto max-w-[1300px] px-4 lg:px-8">
          <Reveal>
            <SectionHead eyebrow="Governance" heading="Governing Council" />
          </Reveal>
          <Reveal>
            <div className="abt-co__grid">
              {council.map((m: any, i: number) => (
                <div className="abt-co-card" key={i}>
                  <span className="abt-co-card__avatar">{initials(m.name)}</span>
                  <div className="abt-co-card__body">
                    <h4 className="abt-co-card__name">{m.name}</h4>
                    {m.role && <p className="abt-co-card__desig">{m.role}</p>}
                  </div>
                  <span className="abt-co-card__role">{m.designation}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Reports & Documents ---- */}
      {docCards.length > 0 && (
        <section className="abt-sec abt-min-sec">
          <div className="container mx-auto max-w-[1300px] px-4 lg:px-8">
            <div className="abt-min__head">
              <div>
                <span className="eyebrow-ed">Documents</span>
                <h2 className="heading-ed" style={{ margin: 0 }}>
                  {reports?.title || "Reports and Documents"}
                </h2>
              </div>
              <div className="abt-min__nav">
                <button className="abt-min-prev" aria-label="Previous">
                  <FaChevronLeft />
                </button>
                <button className="abt-min-next" aria-label="Next">
                  <FaChevronRight />
                </button>
              </div>
            </div>
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{ prevEl: ".abt-min-prev", nextEl: ".abt-min-next" }}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 18 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 22 },
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
            >
              {docCards.map((m: any, i: number) => (
                <SwiperSlide key={i} style={{ height: "auto" }}>
                  <a
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="abt-min-card"
                  >
                    <span className="abt-min-card__top">
                      <span className="abt-min-card__icon">
                        <FaFileAlt />
                      </span>
                      <span className="abt-min-card__date">
                        <FaCalendarAlt /> {m.date}
                      </span>
                    </span>
                    <h3 className="abt-min-card__title">{m.title}</h3>
                    <span className="abt-min-card__link">
                      View Document <FaArrowRight />
                    </span>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* ---- Campuses ---- */}
      {campuses.length > 0 && (
        <section className="abt-sec abt-cp-sec">
          <div className="container mx-auto max-w-[1300px] px-4 lg:px-8">
            <div className="abt-cp__grid">
              <Reveal className="abt-cp__intro">
                <span className="eyebrow-ed">Our Campuses</span>
                <h2 className="heading-ed">The Nagarjuna Family of Institutions</h2>
                <span className="abt-cp__loc">
                  <FaMapMarkerAlt /> Bengaluru, Karnataka
                </span>
                <p className="abt-cp__text">
                  {legacy?.descriptions?.[3] ||
                    "The Group boasts of six institutions ranging from primary school to Post-Graduation in Commerce, Management, Pure Science, Computer Applications and Engineering streams."}
                </p>
                <a href={campuses[0]?.link || "#"} className="abt-cp__cta" target="_blank" rel="noopener noreferrer">
                  Explore Campuses <FaArrowRight />
                </a>
              </Reveal>

              {campus && (
                <Reveal className="abt-cp__showcase">
                  <div className="abt-cp__feature">
                    <div className="abt-cp__feature-media">
                      <img src={campus.image} alt={campus.collegeName} />
                    </div>
                    <div className="abt-cp__feature-body">
                      <h3 className="abt-cp__feature-name">{campus.collegeName}</h3>
                      <span className="abt-cp__feature-loc">
                        <FaMapMarkerAlt /> {campus.location}, Karnataka
                      </span>
                      <a
                        className="abt-cp__feature-link"
                        href={campus.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website <FaArrowRight />
                      </a>
                    </div>
                  </div>
                  <div className="abt-cp__thumbs">
                    {campuses.map((c: any, i: number) => (
                      <button
                        type="button"
                        key={i}
                        className={`abt-cp__thumb${activeCampus === i ? " is-active" : ""}`}
                        onClick={() => setActiveCampus(i)}
                        aria-label={c.collegeName}
                      >
                        <img src={c.image} alt={c.collegeName} />
                      </button>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutPage;
