'use client';

import React from 'react';
import Image from 'next/image';
import { Button, Card, Text } from '@mantine/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRouter } from "next/navigation";

const programs = [
  {
    title: 'Artificial Intelligence & Machine Learning',
    image: '/images/studies/studies_1.png',
  },
  {
    title: 'Information Science And Technology',
    image: '/images/studies/studies_2.png',
  },
  {
    title: 'Artificial Intelligence & Machine Learning',
    image: '/images/studies/studies_1.png',
  },
  // {
  //   title: 'Information Science and Technology',
  //   image: '/images/studies/studies_2.png',
  // },
];

const Studies = () => {
  const router = useRouter();

  const handleProgrammeClick = (programme: string) => {
    router.push(`/department?programme=${encodeURIComponent(programme)}`);
  };

  return (
    <div className="bg-gray-100 py-10 px-5 md:px-20 flex flex-col md:flex-row items-center w-full mt-10">
      <div className="w-full md:w-1/3 text-center md:text-left mb-10 md:mb-0">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0E2455]">PREPARING FOR YOUR STUDIES</h2>
        <Text className="text-[#0E2455] mt-4 text-sm md:text-base" style={{ color: "#0E2455" }}>
          Find out everything about various top performing programmes offered by the university before enrolling.
        </Text>
        <Button onClick={() => router.push("/contact-us")}
          variant="filled"
          size="sm"  
          className="mt-6 text-[white] px-4 font-semibold py-2 bg-[#0E2455] rounded-md cursor-pointer hover:bg-[white] hover:text-[#0E2455]">
            CONTACT US
        </Button>
      </div>
      <div className="w-full md:w-2/3">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 } }}
          loop={true}
          autoplay={{ delay: 3000 }}
          // navigation
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          className="w-full"
        >
          {programs.map((program, index) => (
            <SwiperSlide key={index}>
              <Card shadow="sm" padding="lg" radius="md" className="overflow-hidden w-full max-w-[90%] sm:max-w-[400px] md:max-w-[500px] h-auto mx-auto">
                <img src={program.image} alt={program.title} className="w-full h-[250px] sm:h-[300px] md:h-[350px] object-cover" />
                <div className="p-4">
                  <Text className="font-semibold text-base md:text-lg text-center">{program.title}</Text>
                  <Button onClick={() => handleProgrammeClick(program.title)} fullWidth className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-sm md:text-base" color='#FFB300'>Know More</Button>
                </div>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="custom-pagination mt-7 flex justify-center"></div>
      </div>
    </div>
  );
};

export default Studies;
