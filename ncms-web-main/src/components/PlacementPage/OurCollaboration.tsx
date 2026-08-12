"use client";
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Image from "next/image";

 


const OurCollaboration = ({data}:any) => {
    const {title, images} = data;
  const [swiperKey, setSwiperKey] = useState(0);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setSwiperKey((prev) => prev + 1); // Force re-render on mount
  }, [images]);

  return (
    <div className="rounded-lg mx-auto mb-10 ">
      <h2 className="text-center text-2xl md:text-3xl font-medium font-semibold text-[#003333]">
        {title}
      </h2>

      <div className="relative ">
        {/* Swiper Component */}
        {images?.length > 0 ? (
          <Swiper
            key={swiperKey} // Ensure re-render on data update
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
              1600: { slidesPerView: 6 },
            }}
            navigation={{
              prevEl: prevRef.current, // Link custom buttons
              nextEl: nextRef.current,
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            onInit={(swiper) => {
              // Ensure swiper recognizes buttons after rendering
              setTimeout(() => {
                if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }
              });
            }}
          >
            {images?.map((image:any, index:any) => (
              <SwiperSlide key={index} className="flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg lg:w-60 h-64 md:w-60 md:h-60 flex items-center justify-center mx-auto">
                  <img
                    src={image}
                    alt="image"
                    className="w-50 h-45 object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-500">Loading partners...</p>
        )}

        {/* Custom Navigation Buttons with SVG */}
        <button
          ref={prevRef}
          className="custom-swiper-button-prev cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 z-50"
        >
          <Image src="/images/left-arrow-blue.svg" alt="Left Arrow" width={50} height={67} />
        </button>
        <button
          ref={nextRef}
          className="custom-swiper-button-next cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 z-50"
        >
          <Image src="/images/right-arrow-blue.svg" alt="Right Arrow" width={50} height={67} />
        </button>
      </div>
    </div>
  );
};

export default OurCollaboration;
