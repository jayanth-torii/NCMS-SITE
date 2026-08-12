import React from 'react';
import Image from 'next/image';
 
const LetterAppreciation = ({data}:any) => {
  const {title, certificateImage}  = data;
  return (

    <div className="bg-[#F6F6F6] p-8 flex flex-col items-center rounded-xl  mb-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#003333]">
        {title}         
      </h1>
     
      <Image 
        className='rounded-xl object:contain'
        src={certificateImage}
        alt="certificateImage" 
        height={100}
        width={500}
      />  
        
        
    </div>
  );
};

export default LetterAppreciation;
