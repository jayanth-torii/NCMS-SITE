import React from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FiCopy, FiExternalLink } from "react-icons/fi";

interface PdfViewerProps {
  pdfUrl: string | null;
  onClose: () => void;
}

const PdfModal: React.FC<PdfViewerProps> = ({ pdfUrl, onClose }) => {
  if (!pdfUrl) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080] backdrop-blur-lg bg-opacity-60 flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-0 rounded-2xl w-full max-w-6xl h-auto shadow-xl relative flex flex-col"
      >
        {/* Close Button */}
        <button
          className="absolute cursor-pointer top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition"
          onClick={onClose}
        >
          <IoClose size={24} className="cursor-pointer" />
        </button>

                {/* Copy Link & Open in New Tab */}
                <div className="absolute top-2 right-1/4 transform -translate-x-1/2 flex space-x-4">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            <FiExternalLink size={20} className="text-[#0e2455]" />
          </a>
           
        </div>


        {/* PDF Frame */}
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none rounded-lg"
          style={{ height: "100vh", minHeight: "400px", maxHeight: "95vh", overflow: "auto" }}
        ></iframe>
      </motion.div>
    </div>
  );
};

export default PdfModal;
