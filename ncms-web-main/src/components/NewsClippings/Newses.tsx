"use client";

import Image from "next/image";

const Newses = ({ data }: any) => {
  const { title, description, News } = data;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-100">
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
        {title}
      </h1>

      {/* Description */}
      <p className="text-center text-[#003333] max-w-2xl mb-8">
        {description}
      </p>

      {/* Loop through News items */}
      <div className="w-full space-y-8">
        {News?.map((item:any, itemIndex:any) => (
          <div
            key={itemIndex}
            className="w-full bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
          >
            {/* Images */}
            <div className="flex flex-wrap justify-center gap-4">
              {item.images?.map((img: string, index: number) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Image ${index + 1}`}
                  width={200}
                  height={150}
                  className="rounded-lg"
                />
              ))}
            </div>

            {/* Descriptions */}
            <div className="mt-4 flex flex-col gap-2">
              {item.descriptions?.map((each: string, index: number) => (
                <p
                  key={index}
                  className="text-[#003333] text-center text-justify"
                >
                  {each}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Newses;
