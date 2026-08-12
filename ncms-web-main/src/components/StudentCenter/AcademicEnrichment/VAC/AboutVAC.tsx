"use client";

import React from "react";

interface AboutProps {
  about: {
    title: string;
    AboutDescriptions: string[];
  };
  objectives: {
    title: string;
    Points: string[];
  };
}

const AboutVAC: React.FC<AboutProps> = ({ about, objectives }) => {
  return (
    <div className="mb-10 md:mb-20 text-[#003333]">
      {/* About Section */}
      <div className="bg-[#F6F6F6] p-6 md:p-8 rounded-md mb-3">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{about?.title}</h2>
        <div className="space-y-3 text-justify">
          {about?.AboutDescriptions?.map((desc, index) => (
            <p key={index}>{desc}</p>
          ))}
        </div>
      </div>

      {/* Objectives Section */}
      <div className="bg-[#F6F6F6] p-6 md:p-8 rounded-md">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{objectives?.title}</h2>
        <ul className="text-justify list-disc pl-6 space-y-2">
          {objectives?.Points?.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AboutVAC;
