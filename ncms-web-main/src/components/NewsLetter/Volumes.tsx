'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@mantine/core';
import PdfModal from '../PdfModal';

const Volumes = ({data}:any) => {
  const { title, discription, Volumes } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesPerSlide, setImagesPerSlide] = useState(2);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  useEffect(() => {
    const updateImagesPerSlide = () => {
      setImagesPerSlide(window.innerWidth < 768 ? 1 : 2);
    };
    updateImagesPerSlide();
    window.addEventListener('resize', updateImagesPerSlide);
    return () => window.removeEventListener('resize', updateImagesPerSlide);
  }, []);

  const totalSlides = Math.ceil(Volumes.length / imagesPerSlide);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

  const openPdf = (pdfPath: string) => setSelectedPdf(pdfPath);
  const closePdf = () => setSelectedPdf(null);

  // Auto-scrolling effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentIndex]); // Restart timer on slide change

  return (
    <div className="flex flex-col md:flex-row items-center w-full gap-8 mb-20 md:mb-40">
      {/* Left Section */}
      <div className="p-8 md:p-15 bg-gray-100 w-full md:w-1/3 text-center md:text-left flex flex-col justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold md:mb-10 text-[#003333]">{title}</h2>
          <p className="text-[#003333] text-justify mt-4 mb-5 md:mb-10">{discription}</p>
        </div>
        <div className="hidden md:flex gap-5 justify-start">
          <button onClick={prevSlide} className="cursor-pointer px-5 py-1 text-[#0E2455] border border-[#0E2455] text-sm md:text-base">
            PREVIOUS
          </button>
          <button onClick={nextSlide} className="cursor-pointer px-8 py-1 bg-[#0E2455] text-white text-sm md:text-base">
            NEXT
          </button>
          
        </div>
      </div>

      {/* Right Section - Carousel */}
      <div className="w-full md:w-2/3 overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: totalSlides })?.map((_, slideIndex) => (
            <div key={slideIndex} className="min-w-full flex justify-center gap-5 flex-wrap">
              {Volumes?.slice(slideIndex * imagesPerSlide, slideIndex * imagesPerSlide + imagesPerSlide)?.map((program:any, index:any) => (
                <Card key={index} shadow="sm" padding="lg" radius="md" className="overflow-hidden w-[90%] sm:w-1/2 md:w-[45%] lg:w-[48%] max-w-[500px] h-auto">
                  <Image src={program?.image} alt={program?.title} width={500} height={350} className="w-full h-[250px] sm:h-[300px] md:h-[350px] object-contain" />
                  <div className="p-4">
                    <p className="font-semibold text-[#F09300] text-md md:text-xl text-left">{program?.title}</p>
                    <p className="text-base md:text-lg text-[#0E2455] text-left">{program?.volume}</p>
                    <button className="w-full cursor-pointer px-3 py-2 mt-4 bg-[#0E2455] text-sm md:text-base text-white" onClick={() => openPdf(program.pdf)}>VIEW NOW</button>
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="md:hidden flex gap-5 justify-center mt-5">
          <button onClick={prevSlide} className="cursor-pointer px-5 py-1 text-[#0E2455] border border-[#0E2455] text-sm md:text-base">
            PREVIOUS
          </button>
          <button onClick={nextSlide} className="cursor-pointer px-8 py-1 bg-[#0E2455] text-white text-sm md:text-base">
            NEXT
          </button>
        </div>
      </div>

      {/* PDF Modal Popup  */}
      <PdfModal pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
    </div>
  );
};

export default Volumes;
