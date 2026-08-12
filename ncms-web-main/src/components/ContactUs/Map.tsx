"use client";

import React, { useMemo } from "react";

const Map = ({ data }: any) => {
  const { AdderssLink } = data || {};

  const embedUrl = useMemo(() => {
    const m = String(AdderssLink || "").match(/ll=([\d.]+),([\d.]+)/);
    if (m) {
      return `https://www.google.com/maps?q=${m[1]},${m[2]}&z=15&output=embed`;
    }
    return "https://www.google.com/maps?q=Nagarjuna%20College%20of%20Management%20Studies%20Chikkaballapur&output=embed";
  }, [AdderssLink]);

  return (
    <section className="bg-white pb-20 md:pb-24">
      <div className="container mx-auto max-w-[1300px] px-4 lg:px-8">
        <div className="overflow-hidden rounded-[20px] border border-[#eef1f6] shadow-[0_18px_44px_rgba(15,18,22,0.10)]">
          <iframe
            title="NCMS campus location map"
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="block h-[380px] w-full border-0 grayscale-[8%] md:h-[420px]"
          />
        </div>
      </div>
    </section>
  );
};

export default Map;
