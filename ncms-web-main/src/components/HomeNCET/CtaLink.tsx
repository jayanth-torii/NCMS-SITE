"use client";

import React from "react";
import Link from "next/link";

// Renders an internal <Link> for app routes and a plain <a> for external /
// hash / mailto / tel links. Keeps CTAs data-driven (link comes from JSON).
const isExternal = (link = "") => /^(https?:|mailto:|tel:|#)/.test(link);

const CtaLink = ({
  to,
  className,
  children,
  ...rest
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  if (isExternal(to)) {
    const newTab = to.startsWith("http");
    return (
      <a href={to} className={className} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={to} className={className} {...rest}>
      {children}
    </Link>
  );
};

export default CtaLink;
