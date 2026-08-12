import React from "react";
import PageBanner from "@/components/PageBanner/PageBanner";

const ContactUsBanner = ({ data }: any) => {
  if (!data) return null;
  const { title, bannerImage } = data;

  return (
    <PageBanner
      title={title || "Contact Us"}
      eyebrow="We're Here To Help"
      subtitle="Have a question about admissions, programs, or campus life? Reach out and our team will get back to you."
      image={bannerImage}
    />
  );
};

export default ContactUsBanner;
