'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@mantine/core';

const KnowledgePartners = ({data}:any) => {
  const { title, description, partners } = data;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesPerSlide, setImagesPerSlide] = useState(2);
 

  useEffect(() => {
    const updateImagesPerSlide = () => {
      setImagesPerSlide(window.innerWidth < 768 ? 1 : 2);
    };
    updateImagesPerSlide();
    window.addEventListener('resize', updateImagesPerSlide);
    return () => window.removeEventListener('resize', updateImagesPerSlide);
  }, []);

  const totalSlides = Math.ceil(partners.length / imagesPerSlide);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

 

  // Auto-scrolling effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentIndex]); // Restart timer on slide change

  return (
    <div className="flex flex-col md:flex-row items-center w-full gap-8 mb-10">
      {/* Left Section */}
      <div className="p-8 md:p-15 bg-gray-100 w-full md:w-1/3 text-center md:text-left flex flex-col justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold md:mb-10 text-[#0E2455]">{title}</h2>
        </div>
        <div className="hidden md:flex md:flex-col lg:flex-row  gap-5 justify-start">
          <button onClick={prevSlide} className="px-5 py-1 cursor-pointer text-[#0E2455] border border-[#0E2455] hover:text-[white] hover:bg-[#0E2455] text-sm md:text-base">
            PREVIOUS
          </button>
          <button onClick={nextSlide} className="px-8 py-1 cursor-pointer text-[#0E2455] border border-[#0E2455] hover:text-[white] hover:bg-[#0E2455] text-sm md:text-base">
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
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="min-w-full flex justify-center gap-5 flex-wrap">
              {partners?.slice(slideIndex * imagesPerSlide, slideIndex * imagesPerSlide + imagesPerSlide)?.map((program:any, index:any) => (
                <Card key={index}   padding="lg" radius="md" className="overflow-hidden   rounded-tl-[60px] w-[90%] sm:w-1/2 md:w-[45%] lg:w-[48%] max-w-[500px] h-auto">
                  <Image src={program} alt="image" width={500} height={350} className="w-full h-[250px] sm:h-[300px] md:h-[350px] object-contain" />
                </Card>
              ))}
            </div>
          ))}
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="md:hidden flex gap-5 justify-center mt-5">
          <button onClick={prevSlide} className="px-5 py-1 cursor-pointer text-[#0E2455] border border-[#0E2455] hover:text-[white] hover:bg-[#0E2455] text-sm md:text-base">
            PREVIOUS
          </button>
          <button onClick={nextSlide} className="px-8 py-1 cursor-pointer text-[#0E2455] border border-[#0E2455] hover:text-[white] hover:bg-[#0E2455] text-sm md:text-base">
            NEXT
          </button>
        </div>
      </div>
 
    </div>
  );
};

export default KnowledgePartners;
