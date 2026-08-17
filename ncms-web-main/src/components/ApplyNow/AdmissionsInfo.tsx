"use client";

import React from "react";
import { Clock, FileText, Phone, Mail, MapPin, Check, ExternalLink } from "lucide-react";

import footerDataStatic from "@/data-export/footer/data.json";
import { getFooter } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

/* Generic 4-step admissions process (matches the NCET admissions page) */
const STEPS = [
  {
    title: "Submit Inquiry Form",
    desc: "Fill and submit the quick admission request form with your basic details.",
  },
  {
    title: "Counselor Consultation",
    desc: "Our dedicated admissions expert will reach out to discuss programs, eligibility, and fees.",
  },
  {
    title: "Document Verification",
    desc: "Submit your academic credentials and transfer records for review.",
  },
  {
    title: "Secure Your Seat",
    desc: "Complete the admission formalities and fee payment to confirm enrollment.",
  },
];

/* Standard documents required for admission verification */
const DOCS = [
  "10th Standard / SSLC Marks Card",
  "12th Standard / Pre-University (PUC) Marks Card",
  "Transfer Certificate (TC) & Conduct Certificate",
  "Migration Certificate (for Non-Karnataka candidates)",
  "Recent Passport-size Photographs (4 Copies)",
];

const AdmissionsInfo = () => {
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

  const hotline = phones[0] || "";
  const counselor = phones[1] || "";
  const primaryEmail = emails[0] || "";

  return (
    <aside className="apn-info">
      {/* Admissions Process */}
      <section className="apn-info__section">
        <div className="apn-info__head">
          <span className="apn-info__head-icon">
            <Clock size={20} />
          </span>
          <div>
            <h2>Admissions Process</h2>
            <p>Simple 4-step path to Nagarjuna Institutions</p>
          </div>
        </div>
        <div className="apn-process">
          {STEPS.map((step, i) => (
            <div className="apn-process__card" key={step.title}>
              <span className="apn-process__num">{String(i + 1).padStart(2, "0")}</span>
              <strong>{step.title}</strong>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Required Documents */}
      <section className="apn-info__section">
        <div className="apn-info__head">
          <span className="apn-info__head-icon">
            <FileText size={20} />
          </span>
          <div>
            <h2>Required Documents</h2>
            <p>Keep these documents ready for verification</p>
          </div>
        </div>
        <ul className="apn-docs">
          {DOCS.map((doc) => (
            <li key={doc}>
              <span className="apn-docs__check">
                <Check size={13} strokeWidth={3} />
              </span>
              {doc}
            </li>
          ))}
        </ul>
      </section>

      {/* Admissions Helpdesk — navy box, white text */}
      <section className="apn-helpdesk">
        <div className="apn-helpdesk__head">
          <h3>Admissions Helpdesk</h3>
          <p>Have immediate queries? Contact our helpdesk directly.</p>
        </div>
        <div className="apn-helpdesk__cards">
          {hotline && (
            <div className="apn-helpdesk__card">
              <span className="apn-helpdesk__card-icon">
                <Phone size={16} />
              </span>
              <div className="apn-helpdesk__card-body">
                <strong>Admissions Hotline (Primary)</strong>
                <a href={`tel:${hotline.replace(/\s+/g, "")}`}>+91 {hotline}</a>
              </div>
            </div>
          )}

          {counselor && (
            <div className="apn-helpdesk__card">
              <span className="apn-helpdesk__card-icon">
                <Phone size={16} />
              </span>
              <div className="apn-helpdesk__card-body">
                <strong>Admissions Counselors</strong>
                <a href={`tel:${counselor.replace(/\s+/g, "")}`}>+91 {counselor}</a>
              </div>
            </div>
          )}

          {primaryEmail && (
            <div className="apn-helpdesk__card">
              <span className="apn-helpdesk__card-icon">
                <Mail size={16} />
              </span>
              <div className="apn-helpdesk__card-body">
                <strong>Email Admissions Office</strong>
                <a href={`mailto:${primaryEmail}`}>{primaryEmail}</a>
              </div>
            </div>
          )}

          {address && (
            <div className="apn-helpdesk__card">
              <span className="apn-helpdesk__card-icon">
                <MapPin size={16} />
              </span>
              <div className="apn-helpdesk__card-body">
                <strong>Campus Location</strong>
                <p>{address}</p>
                {addressLink && (
                  <a
                    href={addressLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 800, color: "#f6872a" }}
                  >
                    Get Directions <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </aside>
  );
};

export default AdmissionsInfo;
