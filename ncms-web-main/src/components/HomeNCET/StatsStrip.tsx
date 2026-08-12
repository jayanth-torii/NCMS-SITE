"use client";

import React from "react";
import CountUp from "react-countup";

// Split a value like "2000+" / "15000+" / "11" into a number and a suffix
// so CountUp can animate the number while keeping the "+".
const parseCount = (value: string) => {
  const match = String(value).match(/^(\d+)(.*)$/);
  return {
    end: match ? parseInt(match[1], 10) : 0,
    suffix: match ? match[2] : "",
  };
};

const StatsStrip = ({ data }: { data?: any }) => {
  const items: { count: string; title: string }[] = data || [];

  return (
    <section className="stats-ed" aria-label="NCMS at a glance">
      <div className="container">
        <div className="stats-ed__grid">
          {items.map((stat, i) => {
            const { end, suffix } = parseCount(stat.count);
            return (
              <div className="stats-ed__item" key={i}>
                <span className="stats-ed__num">
                  <CountUp start={0} end={end} suffix={suffix} duration={2.2} />
                </span>
                <span className="stats-ed__label">{stat.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
