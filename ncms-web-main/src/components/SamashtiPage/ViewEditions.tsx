"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EASE = [0.23, 1, 0.32, 1] as const;

const Rise = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, transform: "translateY(26px)" }}
    whileInView={{ opacity: 1, transform: "translateY(0px)" }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, ease: EASE }}
  >
    {children}
  </motion.div>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
);
const IconOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3h7v7M21 3l-9 9M21 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h5" /></svg>
);
const IconSearch = (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>);
const IconChevron = (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>);

// NCMS date strings look like "July to September 2022" — derive year + quarter.
const MONTHS: Record<string, string> = {
  january: "Q1", february: "Q1", march: "Q1",
  april: "Q2", may: "Q2", june: "Q2",
  july: "Q3", august: "Q3", september: "Q3",
  october: "Q4", november: "Q4", december: "Q4",
};
const QLABEL: Record<string, string> = { Q1: "Jan – Mar", Q2: "Apr – Jun", Q3: "Jul – Sep", Q4: "Oct – Dec" };

const deriveYear = (v = "") => (v.match(/(\d{4})/) || [])[1] || "";
const deriveQuarter = (v = "") => {
  const first = (v.trim().split(/\s+/)[0] || "").toLowerCase();
  return MONTHS[first] || "";
};

const SmsDropdown = ({ allLabel, value, options, onSelect }: any) => {
  const [open, setOpen] = useState(false);
  const current = options.find((o: any) => o.value === value);
  return (
    <div className="sms-dd">
      <button type="button" className={`sms-dd__btn${value ? " is-set" : ""}`} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{current ? current.label : allLabel}</span>
        <span className="sms-dd__chev">{IconChevron}</span>
      </button>
      {open && (
        <>
          <div className="sms-dd__menu">
            <button type="button" className={`sms-dd__opt${!value ? " is-active" : ""}`} onClick={() => { onSelect(""); setOpen(false); }}>{allLabel}</button>
            {options.map((o: any) => (
              <button type="button" key={o.value} className={`sms-dd__opt${value === o.value ? " is-active" : ""}`} onClick={() => { onSelect(o.value); setOpen(false); }}>{o.label}</button>
            ))}
          </div>
          <button type="button" className="sms-dd__backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />
        </>
      )}
    </div>
  );
};

const ViewEditions = ({ data }: any) => {
  const { title, description, programs } = data || {};
  const items = programs || [];

  const [query, setQuery] = useState("");
  const [fVolume, setFVolume] = useState("");
  const [fYear, setFYear] = useState("");
  const [fQuarter, setFQuarter] = useState("");
  const [edShowAll, setEdShowAll] = useState(false);
  const EDITIONS_INITIAL = 4;

  const years: string[] = [...new Set(items.map((e: any) => deriveYear(e.date)).filter(Boolean) as string[])].sort((a, b) => Number(b) - Number(a));
  const quarters: string[] = [...new Set(items.map((e: any) => deriveQuarter(e.date)).filter(Boolean) as string[])].sort();

  const filteredEditions = items.filter((ed: any) => {
    const q = query.trim().toLowerCase();
    return (!q || ed.title.toLowerCase().includes(q) || ed.date.toLowerCase().includes(q))
      && (!fVolume || String(ed.id) === fVolume)
      && (!fYear || deriveYear(ed.date) === fYear)
      && (!fQuarter || deriveQuarter(ed.date) === fQuarter);
  });

  useEffect(() => { setEdShowAll(false); }, [query, fVolume, fYear, fQuarter]);

  const visibleEditions = edShowAll ? filteredEditions : filteredEditions.slice(0, EDITIONS_INITIAL);

  return (
    <section className="sms-br" id="editions">
      <div className="container">
        <div className="sms-br__head">
          <Rise className="sms-br__heading">
            <span className="eyebrow-ed">Explore the Editions</span>
            <h2 className="sms-br__title">{title || "Browse All Editions"}</h2>
          </Rise>
          <div className="sms-br__bar">
            <label className="sms-br__search">
              {IconSearch}
              <input type="text" placeholder="Search editions…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search editions" />
            </label>
            <SmsDropdown allLabel="All Volumes" value={fVolume} onSelect={setFVolume} options={items.map((e: any) => ({ value: String(e.id), label: `Volume ${e.id}` }))} />
            <SmsDropdown allLabel="All Years" value={fYear} onSelect={setFYear} options={years.map((y) => ({ value: y, label: y }))} />
            <SmsDropdown allLabel="All Categories" value={fQuarter} onSelect={setFQuarter} options={quarters.map((q) => ({ value: q, label: QLABEL[q] }))} />
          </div>
        </div>

        {filteredEditions.length === 0 ? (
          <p className="sms-br__empty">No editions match your filters.</p>
        ) : (
          <>
            <Rise>
              <div className={`sms-br__grid${edShowAll ? " is-scroll" : ""}`}>
                {visibleEditions.map((ed: any) => (
                  <article className="sms-ed" key={ed.id}>
                    <a className="sms-ed__cover" href={ed.pdf} target="_blank" rel="noopener noreferrer" aria-label={`Read ${ed.title}`}>
                      <img src={ed.image} alt={ed.title} loading="lazy" />
                      <span className="sms-ed__badge">Vol {ed.id}</span>
                    </a>
                    <div className="sms-ed__body">
                      <span className="sms-ed__date"><IconCalendar /> {ed.date}</span>
                      <h3 className="sms-ed__title">{ed.title}</h3>
                      <a className="sms-ed__btn" href={ed.pdf} target="_blank" rel="noopener noreferrer">Read Edition <IconOpen /></a>
                    </div>
                  </article>
                ))}
              </div>
            </Rise>
            {filteredEditions.length > EDITIONS_INITIAL && (
              <div className="sms-br__more">
                <button type="button" className="sms-br__more-btn" onClick={() => setEdShowAll((v) => !v)}>
                  {edShowAll ? "Show Less" : `View More Editions`}
                  <svg className={`sms-br__more-arrow${edShowAll ? " is-up" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ViewEditions;
