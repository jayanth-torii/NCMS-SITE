"use client";

import React from "react";
import { Phone, Mail, MapPin, UserRound, ExternalLink } from "lucide-react";

import footerDataStatic from "@/data-export/footer/data.json";
import { getFooter } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const ApplyNowSidebar = () => {
  const { data: footerData } = useLiveData(getFooter, footerDataStatic as any);
  const d: any = (footerData as any)?.data || footerData || (footerDataStatic as any)?.data || footerDataStatic || {};
  const contactInfo = d?.contactInfo || {};

  const phones = String(contactInfo.phone || "")
    .split("|")
    .map((p: string) => p.trim())
    .filter(Boolean);
  const emails = String(contactInfo.email || "")
    .split(",")
    .map((e: string) => e.trim())
    .filter(Boolean);
  const address = contactInfo.address || "";
  const addressLink = contactInfo.address_link || "";

  return (
    <aside className="apn-side">
      <div className="apn-side__card">
        <header className="apn-side__head">
          <div className="apn-side__title-row">
            <span className="apn-side__icon-tile">
              <UserRound size={19} />
            </span>
            <h3 className="apn-side__heading">Admissions Support</h3>
          </div>
          <p className="apn-side__subtitle">
            Our admissions counselors are here to guide you through every step of the process.
          </p>
        </header>

        <div className="apn-side__body">
          {phones.length > 0 && (
            <div className="apn-side__item">
              <div className="apn-side__item-title">
                <span className="apn-side__item-icon">
                  <Phone size={15} />
                </span>
                <strong>Call Us for Admissions</strong>
              </div>
              <div className="apn-side__chips">
                {phones.map((num: string) => (
                  <a key={num} className="apn-side__chip" href={`tel:${num.replace(/\s+/g, "")}`}>
                    <Phone size={12} />
                    {num}
                  </a>
                ))}
              </div>
            </div>
          )}

          {emails.length > 0 && (
            <div className="apn-side__item">
              <div className="apn-side__item-title">
                <span className="apn-side__item-icon">
                  <Mail size={15} />
                </span>
                <strong>Write to Us</strong>
              </div>
              <div className="apn-side__chips">
                {emails.map((email: string) => (
                  <a key={email} className="apn-side__chip" href={`mailto:${email}`}>
                    <Mail size={12} />
                    {email}
                  </a>
                ))}
              </div>
            </div>
          )}

          {address && (
            <div className="apn-side__item">
              <div className="apn-side__item-title">
                <span className="apn-side__item-icon">
                  <MapPin size={15} />
                </span>
                <strong>Campus</strong>
              </div>
              <p className="apn-side__address">{address}</p>
              {addressLink && (
                <a
                  className="apn-side__directions"
                  href={addressLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions <ExternalLink size={13} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ApplyNowSidebar;
