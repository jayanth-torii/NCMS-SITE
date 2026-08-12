'use client';

import { useState } from 'react';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

type OverviewProps = {
  data: {
    title: string;
    OverViewContent: {
      title: string;
      Sections: {
        title: string | null;
        Points: string[];
      }[];
    }[];
    Collections: {
      title: string;
      Columns: string[];
      Rows: string[][];
    };
  };
};

export default function Overview({ data }: OverviewProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <div className="mx-auto mb-10 md:mb-20 text-[#003333]">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{data?.title}</h1>

      {/* Overview Content Sections */}
      {data?.OverViewContent?.map((section, idx) => (
        <AccordionSection
          key={idx}
          title={section?.title}
          openSections={openSections}
          toggle={toggleSection}
        >
          {section?.Sections?.map((subSec, subIdx) => (
            <div key={subIdx} className="mb-4">
              {subSec?.title && (
                <h3 className="font-semibold mb-1">{subSec.title}</h3>
              )}
              <ul className="list-disc list-inside">
                {subSec?.Points?.map((point, pointIdx) => (
                  <li key={pointIdx}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </AccordionSection>
      ))}

      {/* Collections Section */}
      {data?.Collections && (
        <AccordionSection
          title={data.Collections.title}
          openSections={openSections}
          toggle={toggleSection}
        >
          <div className="overflow-auto">
            <table className="min-w-full text-md border border-[#9E9E9E]">
              <thead>
                <tr className="bg-gray-200">
                  {data.Collections.Columns?.map((col, index) => (
                    <th
                      key={index}
                      className="border border-[#9E9E9E] px-2 py-3"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.Collections.Rows?.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="border px-2 py-3 text-center"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionSection>
      )}
    </div>
  );
}

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  openSections: string[];
  toggle: (title: string) => void;
};

const AccordionSection = ({
  title,
  children,
  openSections,
  toggle,
}: AccordionProps) => {
  const isOpen = openSections.includes(title);

  return (
    <div className="border border-gray-300 rounded-md mb-3">
      <div
        className="flex justify-between items-center bg-gray-100 p-3 cursor-pointer"
        onClick={() => toggle(title)}
      >
        <h2 className="font-normal text-[#0e2455] ml-2 text-xl">{title}</h2>
        {isOpen ? (
          <AiOutlineUp className="text-xl" />
        ) : (
          <AiOutlineDown className="text-xl" />
        )}
      </div>
      {isOpen && (
        <div className="bg-white p-6 transition-all duration-300">
          {children}
        </div>
      )}
    </div>
  );
};
