"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";

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

const StatCell = ({ stat }: { stat: any }) => {
  const numericPart = parseInt(
    String(stat.count ?? "0").replace(/,/g, "").match(/\d+/)?.[0] || "0",
    10
  );
  const suffix = String(stat.count ?? "").replace(/[0-9,]/g, "");
  const { value, ref } = useCountUp(numericPart);

  return (
    <div ref={ref} className="text-center p-[6px]">
      {stat.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={stat.icon}
          alt=""
          className="mx-auto mb-2 h-10 w-10 object-contain"
        />
      ) : null}
      <span className="block text-[#0e2455] text-[32px] font-extrabold leading-none tracking-[-1px]">
        {value}
        {suffix}
      </span>
      <span className="block text-[#777777] text-[13px] font-semibold mt-[8px]">
        {stat.title}
      </span>
    </div>
  );
};

export default function Stats({ data }: { data?: any[] }) {
  if (!data || data?.length === 0) return null;

  return (
    <section className="bg-white py-[46px] border-b border-[#eef1f6]" aria-label="NCMS at a glance">
      <div className="container mx-auto px-4 max-w-[1300px]">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[16px] md:gap-y-[28px] lg:gap-y-[16px]">
            {data.map((stat, index) => (
              <div
                key={index}
                className={`border-[#eef1f6]
                  ${index % 2 !== 0 ? "max-md:border-l" : "max-md:border-l-0"}
                  ${index % 3 !== 0 ? "md:max-lg:border-l" : "md:max-lg:border-l-0"}
                  ${index % 6 !== 0 ? "lg:border-l" : "lg:border-l-0"}
                `}
              >
                <StatCell stat={stat} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
