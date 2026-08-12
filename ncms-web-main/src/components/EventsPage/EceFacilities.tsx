"use client";
 
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
 
const images = [
  { id: 1, src: "/images/EceFacilities/ecefacilities-image-1.png", lab: "BASIC ELECTRONIC LAB", alt: "EceFacilities Image 1" },
  { id: 2, src: "/images/EceFacilities/ecefacilities-image-2.png", lab: "Digital electronic circuit lab", alt: "EceFacilities Image 2" },
  { id: 3, src: "/images/EceFacilities/ecefacilities-image-3.png", lab: "FUNDAMENTALS OF HDL LAB", alt: "EceFacilities Image 3" },
  { id: 4, src: "/images/EceFacilities/ecefacilities-image-3.png", lab: "FUNDAMENTALS OF HDL LAB", alt: "EceFacilities Image 3" },
  { id: 5, src: "/images/EceFacilities/ecefacilities-image-1.png", lab: "BASIC ELECTRONIC LAB", alt: "EceFacilities Image 1" },
  { id: 6, src: "/images/EceFacilities/ecefacilities-image-2.png", lab: "Digital electronic circuit lab", alt: "EceFacilities Image 2" },
];
 
const EceFacilities = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
 
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex + 3 >= images.length ? 0 : prevIndex + 3
    );
  };
 
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex - 3 < 0 ? images.length - 3 : prevIndex - 3
    );
  };
 
  return (
    <div className="w-full rounded-lg bg-white mb-20 mt-20">
      <h2 className="text-3xl font-semibold mb-5 text-[#003333]">FACILITIES</h2>
      <div className="flex items-center overflow-hidden relative">
 
        {/* Left Arrow */}
        <button onClick={prevImage} className="absolute left-2 p-2 bg-[#0E2455] border border-black rounded-full hover:bg-gray-200 transition duration-300">
          <FaArrowLeft className="tes-icon" color="white" width={50} />
        </button>
 
        <div className="flex gap-4 w-full justify-center">
          {/* Single Image for Small Screens */}
          <div className="block sm:hidden w-full">
            <div className="flex flex-col justify-center items-center">
              <img src={images[currentImageIndex].src} alt={images[currentImageIndex].alt} className="w-full h-64 object-cover rounded-md shadow-md" />
              <button className="relative bg-[#0E2455] text-white w-full h-12 bottom-3">{images[currentImageIndex].lab}</button>
            </div>
          </div>
 
          {/* Three Images for Medium and Large Screens */}
          <div className="hidden sm:flex gap-4 w-full justify-center">
            {images.slice(currentImageIndex, currentImageIndex + 3).map((image) => (
              <div key={image.id} className="flex flex-col justify-center items-center w-1/3">
                <img src={image.src} alt={image.alt} className="w-full h-64 object-cover rounded-md shadow-md" />
                <button className="relative bg-[#0E2455] text-white w-full h-12 bottom-3">{image.lab}</button>
              </div>
            ))}
          </div>
        </div>
 
        {/* Right Arrow */}
        <button onClick={nextImage} className="absolute right-1 p-2 bg-[#0E2455] text-black border border-black rounded-full hover:bg-gray-200 transition duration-300">
          <FaArrowRight className="tes-icon" color="white" width={50} />
        </button>
       
      </div>
    </div>
  );
};
 
export default EceFacilities;