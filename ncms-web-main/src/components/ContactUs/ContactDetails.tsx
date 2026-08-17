"use client";

import React from "react";
import { IconPhone, IconMail, IconMapPin } from "@tabler/icons-react";

const telHref = (num: string) => `tel:${num.replace(/[^\d+]/g, "")}`;

type ParsedRow = {
  label: string;
  parts: string[];
  type: "phone" | "email";
};

const parseLine = (line: string): ParsedRow | null => {
  const m = line.match(/^([^:]+):\s*(.+)$/);
  if (!m) return null;
  const label = m[1].trim();
  const parts = m[2]
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  const isEmail = parts.every((p) => p.includes("@"));
  return { label, parts, type: isEmail ? "email" : "phone" };
};

const ContactDetails: React.FC<{ data: any; mapLink?: string }> = ({ data, mapLink }) => {
  if (!data) return null;
  const { sections = [] } = data;

  const getSection = (title: string) =>
    sections.find((s: any) => s.title?.trim().toLowerCase() === title.toLowerCase());

  const touchSection = getSection("Get In Touch");
  const addressSection = getSection("Address");
  const introSection = getSection("Contact Us");

  const rows: ParsedRow[] = (touchSection?.descriptions || [])
    .map((line: string) => parseLine(line))
    .filter((r: ParsedRow | null): r is ParsedRow => r !== null);

  const intro = (introSection?.descriptions || []).join(" ");
  const addressLines: string[] = (addressSection?.descriptions || [])
    .join("\n")
    .split("\n")
    .filter(Boolean);

  const mapsLink =
    mapLink ||
    "https://www.google.com/maps?ll=13.352492,77.728078&z=15&t=m&hl=en&gl=IN&mapclient=embed&cid=17112812228345469983";

  return (
    <div className="max-w-[560px]">
      <span className="mb-3 inline-flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[2.6px] text-orange">
        <span className="h-[2px] w-7 rounded-full bg-orange" />
        Get In Touch
      </span>
      <h2 className="mb-4 text-[28px] font-extrabold leading-[1.12] tracking-[-0.5px] text-navy sm:text-[34px]">
        Talk to our <span className="text-orange">team</span>
      </h2>
      <p className="mb-9 text-[15px] leading-[1.7] text-body-gray md:text-[16px]">
        {intro ||
          "Thank you for visiting our website. If you have feedback, we are eager to hear from you."}
      </p>

      {/* Contact cards — stacked in the left column */}
      <div className="flex flex-col gap-5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start gap-4 rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_14px_34px_rgba(15,18,22,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-orange/30 hover:shadow-[0_20px_44px_rgba(15,18,22,0.10)]"
          >
            <span className="mt-0.5 flex h-[44px] w-[44px] flex-none items-center justify-center rounded-xl bg-chip-bg text-orange">
              {row.type === "email" ? <IconMail size={19} /> : <IconPhone size={19} />}
            </span>
            <div className="min-w-0">
              <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-[0.9px] text-orange">{row.label}</p>
              <div className="flex flex-wrap items-center text-[15px] font-semibold leading-[1.55] text-navy">
                {row.parts.map((part, i) => (
                  <React.Fragment key={part}>
                    {i > 0 && <span className="mx-[6px] text-[#c2c8d4]">·</span>}
                    {row.type === "email" ? (
                      <a href={`mailto:${part}`} className="break-all transition-colors hover:text-blue-accent">
                        {part}
                      </a>
                    ) : (
                      <a href={telHref(part)} className="whitespace-nowrap transition-colors hover:text-blue-accent">
                        {part}
                      </a>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Address */}
      {addressLines.length > 0 && (
        <div className="mt-6 rounded-2xl border border-card-border bg-white p-6 shadow-[0_14px_34px_rgba(15,18,22,0.06)]">
          <h3 className="mb-3 flex items-center gap-2.5 text-[16px] font-extrabold text-navy">
            <span className="inline-block h-[2px] w-[22px] bg-orange" />
            Campus Address
          </h3>
          <address className="mb-4 text-[15px] font-normal leading-[1.65] text-body-gray">
            {addressLines.map((ln, i) => (
              <React.Fragment key={ln}>
                {ln}
                {i < addressLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </address>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-orange/40 px-5 py-2.5 text-[14px] font-bold text-navy transition-all duration-300 hover:border-orange hover:bg-orange/5"
          >
            <IconMapPin size={16} className="text-orange" />
            View On Google Maps
          </a>
        </div>
      )}
    </div>
  );
};

export default ContactDetails;
