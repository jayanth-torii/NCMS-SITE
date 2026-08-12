import React from 'react';
import Image from 'next/image';
import { Paper } from '@mantine/core';

const NCMSCertificate = ({data}:any) => {
  const {title, certificateTitle, certificateImage}  = data
  return (
    <div className=' mb-10 md:mb-20'>

    <div className="p-4 md:pl-8 relative w-full flex flex-col md:flex-row items-center justify-around overflow-hidden border-[6px] border-[#CB994A] rounded-xl">
      <div className='w-1/2'>
        <h1 className='text-lg  sm:text-5xl text-[#F6872A] font-semibold'>{title}</h1>
        <h1 className='text-lg  sm:text-5xl text-[#003333] font-semibold'>{certificateTitle}</h1>
      </div>
      <div className='w-1/2'>
        <Paper className="relative w-full h-[25vh] sm:h-[50vh] lg:h-[80vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image 
              className='rounded-xl object:contain md:object:cover"'
              src={certificateImage}
              alt="certificateImage" 
              layout="fill" 
              priority
            />
          </div>
        </Paper>
      </div>
    </div>

  </div>
  );
};

export default NCMSCertificate;
