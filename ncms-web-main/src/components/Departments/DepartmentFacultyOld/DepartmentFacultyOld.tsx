// "use client";

// import React, {useState, useEffect, Suspense} from "react";
// import { useSearchParams } from "next/navigation";
// import { motion } from "framer-motion";
// import { IoClose } from "react-icons/io5";
// import PdfModal from "../../PdfModal";

// import axios from "axios";
// import { BASE_URL } from "@/config/apiService";
// import { facultyContent } from "@/app/Data/facultyContent";


// const DepartmentFaculty = () => {

//   // FETCHING API'S DATA
//   const [facultyData, setFacultyData] = useState(null);
//   useEffect(() => {
//     const fetchFacultyContent = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/faculty-contents`);
//         setFacultyData(response?.data);
//       //  console.log("Fetched  FacultyData Data:=====>", response.data);
//       } catch (error) {
//         console.error("Error fetching FacultyData data:", error);
//       }
//     };
//     fetchFacultyContent();
//   }, []);


//   const searchParams = useSearchParams();
//   const programme = searchParams.get("programme") || "";
//   const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

//   const normalizedProgramme = programme
//     .trim()
//     .toLowerCase()
//     .replace(/&/g, "and")
//     .replace(/\s+/g, " ");

//   const openPdf = (pdfUrl: string) => {
//     setSelectedPdf(pdfUrl);
//   };

//   if (!facultyContent) {
//     return <p>Loading faculty data...</p>;
//   }
 

//   const contentMapping: Record<string, any> = {
//     "science" :facultyContent.Science,
//     "commerce and management" : facultyContent.UG_Commerce,
//     "computer application" : facultyContent.UG_CA,
//     "masters in business administration": facultyContent.MBA,
//     "masters of commerce": facultyContent.MOC,
//     "masters of computer application": facultyContent.MCA,
//     "department of kannada": facultyContent.DOK,
//     "department of hindi": facultyContent.DOH,
//     "department of english": facultyContent.DOE,

//   };

//   const content = contentMapping[normalizedProgramme] || [];

//   return (

//     <>
//     <div className="overflow-x-auto mb-10 md:mb-20 mt-10 md:mt-0">
//     <h2 className="text-2xl md:text-3xl font-bold text-[#003333] mb-4">DEPARTMENT FACULTIES</h2>
//       <table className="w-full border-collapse border border-gray-400">
//         <thead>
//           <tr className="text-sm md:text-lg bg-[#C2C0C017] text-[#003333] border-b border-gray-400 text-left">
//             <th className="p-3 border-r border-gray-400 text-lg   text-center">SN</th>
//             <th className="p-3 border-r border-gray-400 text-lg  ">Name & Designation</th>
//             <th className="p-3 border-r border-gray-400 text-lg  ">Qualification</th>
//           </tr>
//         </thead>
//         <tbody>
//           {content.map((faculty: any, index: number) => (
//             <tr
//               key={index}
//               className="text-sm md:text-base bg-[#C2C0C017] border-b border-gray-400 text-[#003333] hover:bg-gray-200"
//             >
//               <td className="py-2   px-3 border-r border-gray-400 text-center  ">{index + 1}</td>
//               <td onClick={() => openPdf(faculty.profilePdf)} className="py-2   px-3 border-r border-gray-400 whitespace-nowrap  ">
//                 <span className="text-[green] cursor-pointer hover:underline">{faculty.name}</span> <br /> {faculty.designation}
//               </td>
//               <td className="py-2   px-3 border-r border-gray-400  text-[#003333]">{faculty.qualification}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>

//     {/* PDF Modal Popup */}
//     <PdfModal pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
//   </>
//   );
// };

// export default DepartmentFaculty;
