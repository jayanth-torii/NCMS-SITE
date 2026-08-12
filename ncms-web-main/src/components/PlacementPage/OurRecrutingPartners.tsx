"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
 

const OurRecrutingPartners = ({data}:any) => {
  const partners = data;
  const [swiperKey, setSwiperKey] = useState(0);

  useEffect(() => {
    setSwiperKey((prev) => prev + 1); // Force re-render on mount
  }, [partners]);

  return (
    <div className="rounded-lg mx-auto mb-10">
      <h2 className="text-center text-2xl md:text-3xl font-medium font-semibold text-[#003333] mb-8">
        OUR RECRUITING PARTNERS
      </h2> 

      <div className="relative">
        {/* Swiper Component */}
        {partners?.length > 0 ? (
          <Swiper
            key={swiperKey} // Ensure re-render on data update
            modules={[Autoplay, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
              1600: { slidesPerView: 6 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
 
            onSlideChange={(swiper) => {
              setTimeout(() => {
                document.querySelectorAll(".swiper-pagination-bullet").forEach((bullet, i) => {
                  if (bullet instanceof HTMLElement) {
                    bullet.style.width = i === swiper.realIndex ? "30px" : "10px";
                  }
                });
              }, 10);
            }}
          >
            {partners?.map((partner:any, index:any) => (
              <SwiperSlide key={index} className="flex justify-center items-center mb-20 md:ml-8">
                <div className="relative bg-[#000000] shadow-lg h-64 md:h-60 flex items-center justify-center mx-auto w-full max-w-xs md:max-w-none">
                  <img
                    src={partner?.image}
                    alt={partner?.title}
                    className="relative top-2 left-2 w-full h-full border border-[#0E2455] object-cover"
                  />
                </div>
              </SwiperSlide>


 
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-500">Loading partners...</p>
        )}
      </div>
    </div>
  );
};

export default OurRecrutingPartners;