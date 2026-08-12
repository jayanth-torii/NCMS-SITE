"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FaHome } from "react-icons/fa";

// Define a mapping for custom names
const pathMappings:  { [key: string]: string } = {
  "ug-programmes": "UG Programme",
  "pg-programmes": "PG Programme",
  "language": "language",
  "statutory-cells": "Statutory Cells",
  "academic-enrichment": "Academic Enrichment",
  "community-services": "Community Services",
};
// Define programme categories (Departments)
const pgProgrammes = ["Masters In Business Administration", "Masters Of Commerce", "Masters of Computer Application"];
const ugProgrammes = [
  "Commerce & Management",
  "Computer Application",
  "Science",
];
const language = [
  "Department of Kannada",
  "Department Of Hindi",
  "Department Of English",
];



/** Student Center config (use URL slugs for matching) */
const SC_TABS = {
  "statutory-cells": {
    label: "Statutory Cells",
    children: [
      "anti-ragging-cell",
      "anti-sexual-harassment-cell",
      "grievenvance-redressal-cell",
      "sc-st-obc-cell",
      "unity-council",
      "human-rights-cell",
    ],
  },
  "academic-enrichment": {
    label: "Academic Enrichment",
    children: [
      "value-added-programs",
      "ed-cell",
      "research-cell",
      "library",
      "commerce-forum",
      "nptel-local-chapter",
      "pragyan-science-forum",
    ],
  },
  "community-services": {
    label: "Community Services",
    children: [
      "nss",
      "cultural-committee",
      "ncc",
      "sakhi-samrudhi-women-empowerment-cell",
      "kala-chaitanya",
    ],
  },
} as const;

type SCTabSlug = keyof typeof SC_TABS;

const SC_CHILD_TO_PARENT: Record<string, SCTabSlug> = Object.fromEntries(
  Object.entries(SC_TABS).flatMap(([slug, cfg]) => cfg.children.map((c) => [c, slug as SCTabSlug]))
) as Record<string, SCTabSlug>;

// Infer current student-center tab from URL segments (tab slug or any child slug)
const getStudentCenterTab = (segments: string[]): SCTabSlug | undefined => {
  for (const s of segments) if (s in SC_TABS) return s as SCTabSlug; // parent present
  for (const s of segments) if (s in SC_CHILD_TO_PARENT) return SC_CHILD_TO_PARENT[s]; // child present
  return undefined;
};

// Build deep-link to the tab hash
const studentCenterHref = (slug: SCTabSlug) => `/student-center#${encodeURIComponent(SC_TABS[slug].label)}`;

const Breadcrumb: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract programme name from query parameters
  const programmeName = decodeURIComponent(searchParams.get("programme") || "").trim();

  // figure out the programme category (for Departments)
  let programmeCategory = "";
  if (pgProgrammes.includes(programmeName)) {
    programmeCategory = "pg-programmes";
  } else if (ugProgrammes.includes(programmeName)) {
    programmeCategory = "ug-programmes";
  } else if (language.includes(programmeName)) {
    programmeCategory = "language";
  }

  // anchor id for Departments page
  const programmeCategoryHash = programmeCategory
    .replace("-programmes", "_programme")
    .replace("-and-technology", "_programme")
    .replace("-", "_");

  // current URL segments
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentSCTab = getStudentCenterTab(pathSegments);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
 

  return (
    <nav  onClick={scrollToTop} className={`w-[90%] mt-8 mx-auto flex flex-wrap items-center space-x-2 mb-8 text-gray-700 ${className}`}>
      {/* Home Icon + Homepage Link */}
      <Link href="/"  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700" aria-label="Home">
        <FaHome className="w-5 h-5" />
      </Link>
      

      {/* Departments trail */}
      {programmeCategory && (
        <>
          <span className="text-gray-400">›</span>
          <Link href="/departments" className="text-gray-500 hover:text-gray-700 capitalize break-words">
            Departments
          </Link>

          <span className="text-gray-400">›</span>
          <Link href={`/departments#${programmeCategoryHash}`} className="text-gray-500 hover:text-gray-700 capitalize break-words">
            {pathMappings[programmeCategory] || programmeCategory.replace("-", " ").toUpperCase()}
          </Link>
        </>
        )}

      {/* Dynamic Breadcrumb Links */}
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;

        // display label
        const mapped = pathMappings[segment] || decodeURIComponent(segment).replace(/-/g, " ");
        const displayName = mapped.toUpperCase();

        // skip duplicate programme leaf
        if (programmeName && segment === programmeName.toLowerCase().replace(/ /g, "-")) return null;

        // default cumulative href
        let href: string = "/" + pathSegments.slice(0, index + 1).join("/");

        // Student Center rules: always deep-link to tab hash
        if (segment === "student-center" && currentSCTab) {
          href = studentCenterHref(currentSCTab);
        } else if (segment in SC_TABS) {
          href = studentCenterHref(segment as SCTabSlug);
        } else if (currentSCTab && SC_CHILD_TO_PARENT[segment] === currentSCTab) {
          href = studentCenterHref(currentSCTab);
        }

        return (
          <div key={`${index}-${segment}`} className="flex items-center space-x-2 break-words">
            <span className="text-gray-400">›</span>
            {!isLast ? (
              <Link href={href} className="text-gray-500 hover:text-gray-700 capitalize break-words">
                {displayName}
              </Link>
            ) : (
              // Only show programme name at the end
              <span className="text-orange-600 font-semibold capitalize break-words">
                {programmeName || displayName}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
