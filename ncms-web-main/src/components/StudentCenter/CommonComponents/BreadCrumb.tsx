"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FaHome } from "react-icons/fa";

const pathMappings: { [key: string]: string } = {
  "ug-programmes": "UG Programme",
  "pg-programmes": "PG Programme",
  "science-programmes": "Basic Sciences",
};

const pgProgrammes = ["Department Of MBA", "M.Tech Structural"];
const ugProgrammes = [
  "Computer Science & Engineering",
  "Artificial Intelligence & Machine Learning",
  "Electronics And Communication Engineering",
  "Information Science And Technology",
  "CSE Data Science",
  "Civil Engineering",
];
const scienceProgrammes = [
  "Department Of Mathematics",
  "Department Of Physics",
  "Department Of Chemistry",
  "Social Science & Foreign Languages",
  "Mechanical Engineering",
];

const Breadcrumb: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const programmeName = decodeURIComponent(searchParams.get("programme") || "").trim();

  let programmeCategory = "";
  if (pgProgrammes.includes(programmeName)) {
    programmeCategory = "pg-programmes";
  } else if (ugProgrammes.includes(programmeName)) {
    programmeCategory = "ug-programmes";
  } else if (scienceProgrammes.includes(programmeName)) {
    programmeCategory = "science-programmes";
  }

  let programmeCategoryHash = programmeCategory
    .replace("-programmes", "_programme") // Convert ug-programmes -> ug_programme
    .replace("-and-technology", "_programme") // Fix science-and-technology -> science_programme
    .replace("-", "_"); // General fix for remaining dashes

  // Get the current path segments
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <nav className={`w-[90%] mt-8 mx-auto flex flex-wrap items-center space-x-2 mb-8 text-gray-700 ${className}`}>
      {/* Home Icon + Homepage Link */}
      <Link href="/" className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
        <FaHome className="w-5 h-5" />
      </Link>

      {/* Departments Section */}
     

      {/* Add Programme Category if it exists */}
      {programmeCategory && (
        <>

<     span className="text-gray-400">›</span>
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

        // Fix incorrect UG/PG/Science categorization in URL
        let href = "/" + pathSegments.slice(0, index + 1).join("/");
        if (segment === "ug-programmes" || segment === "pg-programmes" || segment === "science-programmes") {
          href = `/departments#${programmeCategoryHash}`; // Fix: Now uses correct hash format
        }

        // Display correct name
        let displayName = (pathMappings[segment] || decodeURIComponent(segment)).toUpperCase();

        // Skip programme name from default breadcrumb flow (handled separately)
        if (programmeName && segment === programmeName.toLowerCase().replace(/ /g, "-")) return null;

        return (
          <div key={href} className="flex items-center space-x-2 break-words">
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