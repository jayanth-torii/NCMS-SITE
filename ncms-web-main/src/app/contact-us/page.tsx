"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ContactUsBanner from "@/components/ContactUs/ContactUsBanner";
import ContactDetails from "@/components/ContactUs/ContactDetails";
import QueryForm from "@/components/ContactUs/QueryForm";
import Map from "@/components/ContactUs/Map";

import contactUsData from "@/data-export/contact-us/data.json";
import { getContactUsPage } from "@/services/data.service";
import { useLiveData } from "@/hooks/useLiveData";

const ContactUs = () => {
  const { data: liveContact } = useLiveData(getContactUsPage, contactUsData);
  return (
    <>
      <Suspense>
        <div className="border-b border-card-border bg-white">
          <div className="container mx-auto max-w-[1300px] px-4 py-3 lg:px-8">
            <Breadcrumb className="ml-0" />
          </div>
        </div>
      </Suspense>

      <ContactUsBanner data={liveContact?.banner} />

      {/* Talk to our team + Submit Your Query — one row on desktop */}
      <section className="bg-[#f8fafc] py-14 md:py-20">
        <div className="container mx-auto grid max-w-[1300px] grid-cols-1 items-start gap-10 px-4 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:px-8">
          <ContactDetails data={liveContact?.contactDetails} mapLink={liveContact?.Map_Section?.AdderssLink} />
          <QueryForm />
        </div>
      </section>

      <Map data={liveContact?.Map_Section} />
    </>
  );
};

export default ContactUs;
