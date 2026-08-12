"use client";

import React, { useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

// Interfaces for type safety
interface Course {
  id: number;
  name: string;
  duration: string;
}

interface YearData {
  id: number;
  year: string;
  courses: Course[];
}

interface YearWiseCoursesProps {
  data: {
    title: string;
    years: YearData[];
  };
}

const YearWiseCourses: React.FC<YearWiseCoursesProps> = ({ data }) => {
  const [openYears, setOpenYears] = useState<string[]>([]);

  const toggleYear = (year: string) => {
    setOpenYears(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  return (
    <div className="mb-10 md:mb-20">
      <h2 className="text-xl md:text-2xl font-bold text-[#0E2455] mb-6">
        {data?.title}
      </h2>
      <div className="space-y-2">
        {data?.years?.map((yearData) => {
          const isOpen = openYears.includes(yearData.year);

          return (
            <div key={yearData.id} className="overflow-hidden border border-[#DCDCDC] rounded-md">
              <button
                onClick={() => toggleYear(yearData.year)}
                className="w-full flex justify-between items-center p-4 bg-[#F6F6F6] cursor-pointer text-lg font-semibold text-[#0E2455]"
              >
                {yearData.year}
                {isOpen ? <AiOutlineUp className="text-xl" /> : <AiOutlineDown className="text-xl" />}
              </button>

              {isOpen && yearData.courses.length > 0 && (
                <div className="m-3 bg-white">
                  <table className="w-[98%] mx-auto border-collapse rounded-md border text-[#003333]">
                    <thead>
                      <tr className="bg-[#f6f6f6] rounded-md">
                        <th className="border border-[#DCDCDC] px-4 py-2 text-left text-lg">Courses</th>
                        <th className="border border-[#DCDCDC] px-4 py-2 text-left text-lg">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearData.courses.map((course) => (
                        <tr key={course.id} className="border-b border-gray-300">
                          <td className="border border-[#DCDCDC] px-4 py-2">{course.name}</td>
                          <td className="border border-[#DCDCDC] px-4 py-2">{course.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearWiseCourses;
