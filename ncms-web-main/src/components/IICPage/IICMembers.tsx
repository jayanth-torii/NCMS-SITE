"use client";

import { useState } from "react";
import { Box } from "@mantine/core";
import { AiOutlineArrowRight } from "react-icons/ai";
import PdfModal from "@/components/PdfModal";

const IICMembers = ({ data }: { data: any }) => {
  const sectionsData = data?.tabs || {};
  const tabKeys = Object.keys(sectionsData);
  const [activeTab, setActiveTab] = useState<string>(tabKeys[0] || "");
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const openPdf = (pdfUrl: string) => {
    setSelectedPdf(pdfUrl);
  };

  const closePdf = () => {
    setSelectedPdf(null);
  };

  return (
    <Box className="mb-20">
      <div className="flex flex-col md:flex-row justify-between mb-10 gap-5">
        <h1 className="text-2xl md:text-3xl font-bold text-[#003333]">
          {data?.title || "MEMBERS OF IIC"}
        </h1>
        {data?.pdf && (
          <button
            onClick={() => openPdf(data.pdf)}
            className="cursor-pointer flex items-center justify-center w-full md:w-auto bg-[#0E2455] text-white border border-black px-4 py-2 rounded-sm"
          >
            VIEW COMPOSITION <AiOutlineArrowRight className="ml-2" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="w-full flex flex-col md:flex-row items-start md:justify-start md:space-x-8 mb-10 border-b border-gray-300">
        {tabKeys.map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`text-[#003333] cursor-pointer !text-xl text-start leading-[1] !font-semibold pb-2 ${
              activeTab === key ? "border-b-4 md:border-b-8 border-[#FFB300]" : ""
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-400 shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#C2C0C017] text-[#003333] border-b border-gray-400 text-left">
              <th className="p-3 border-r border-gray-400 text-center text-lg">SI.No</th>
              <th className="p-3 border-r border-gray-400 text-lg">Name</th>
              <th className="p-3 border-r border-gray-400 text-lg">Designation/Department</th>
              <th className="p-3 text-lg">Key Position In IIC</th>
            </tr>
          </thead>
          <tbody>
            {sectionsData[activeTab]?.map((member: any, idx: number) => (
              <tr
                key={idx}
                className="text-sm md:text-base bg-white border-b border-gray-400 text-[#003333] hover:bg-gray-200"
              >
                <td className="py-2 px-3 border-r border-gray-400 text-center">{member.sn}</td>
                <td className="py-2 px-3 border-r border-gray-400 whitespace-nowrap">
                  {member.name}
                  <br />
                  {member.mail}
                  <br />
                  {member.number}
                </td>
                <td className="py-2 px-3 border-r border-gray-400">{member.designation}</td>
                <td className="py-2 px-3">{member.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PDF Modal */}
      {selectedPdf && <PdfModal pdfUrl={selectedPdf} onClose={closePdf} />}
    </Box>
  );
};

export default IICMembers;
