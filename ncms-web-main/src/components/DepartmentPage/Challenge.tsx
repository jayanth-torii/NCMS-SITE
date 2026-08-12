"use client";

import Image from "next/image";

const Challenge = ({data}:any) => {
   if (!data) return null;
  return (
    <div className="w-full bg-gray-100">
      <div className="w-[90%] m-auto bg-gray-100 mb-10 rounded-lg mt-10">
        <div className="grid md:grid-cols-2 items-center gap-10">
          {/* Text Section */}
          <div className="p-5 max-w-lg">
            <h1 className="inline-block text-2xl md:text-4xl mb-4 text-[#0e2455] font-bold border-b-4 border-b-[#ffb300]">
              {data?.title}
            </h1>
            {/* <div className="mb-5 md:mb-12 w-1/2 h-1 bg-[#ffb300]"></div> */}
            <p className="text-justify sm:text-lg text-[#0e2455] font-serif">
              {data?.description}
            </p>
          </div>

          {/* Image Grid Section */}
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-5 relative">
              {/* Image 1 with overlay */}
              <div className="relative flex items-center justify-center">
                <Image
                  src={data?.images[0]?.image}
                  alt={data?.images[0]?.alt}
                  width={220}
                  height={240}
                  className="object-cover w-full h-auto rounded-lg"
                />
                <p className="absolute text-white text-xs sm:text-sm p-2 rounded-md max-w-[85%] font-serif break-words overflow-hidden text-ellipsis">
                  {data?.images[0]?.text}
                </p>
              </div>

              {/* Image 2 */}
              <div>
                <Image
                  src={data?.images[1]?.image}
                  alt={data?.images[1]?.alt}
                  width={200}
                  height={250}
                  className="object-cover w-full h-auto rounded-lg"
                />
              </div>

              {/* Image 3 */}
              <div className="mb-10">
                <Image
                  src={data?.images[2]?.image}
                  alt={data?.images[2]?.alt}
                  width={200}
                  height={180}
                  className="object-cover w-full h-auto rounded-lg"
                />
              </div>

              {/* Image 4 */}
              <div className="relative -top-10">
                <Image
                  src={data?.images[3]?.image}
                  alt={data?.images[3]?.alt}
                  width={220}
                  height={200}
                  className="object-cover w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenge;






// "use client";

// import Image from "next/image";

// const Challenge = ({data}:any) => {
//   return (
//     <div className="w-full bg-gray-100">
//       <div className="w-[90%] m-auto bg-gray-100 mb-10 rounded-lg mt-10">
//         <div className="grid md:grid-cols-2 items-center gap-10">
//           {/* Text Section */}
//           <div className="p-5 max-w-lg">
//             <h1 className="text-2xl md:text-4xl mb-4 text-[#0e2455] font-bold">
//               {data.title}
//             </h1>
//             <div className="mb-5 md:mb-12 w-1/2 h-1 bg-[#ffb300]"></div>
//             <p className="text-justify sm:text-lg text-[#0e2455] font-serif">
//               {data.description}
//             </p>
//           </div>

//           {/* Image Grid Section */}
//           <div className="flex justify-center">
//             <div className="grid grid-cols-2 gap-5 relative">
//               {/* Image 1 with overlay */}
//               <div className="relative flex items-center justify-center">
//                 <Image
//                   src={data.images[0].src}
//                   alt={data.images[0].alt}
//                   width={220}
//                   height={240}
//                   className="object-cover w-full h-auto rounded-lg"
//                 />
//                 <p className="absolute text-white text-xs sm:text-sm p-2 rounded-md max-w-[85%] font-serif break-words overflow-hidden text-ellipsis">
//                   {data.images[0].text}
//                 </p>
//               </div>


//               <div className="relative flex items-center justify-center">
//                 <Image
//                   src={data.images[1].src}
//                   alt={data.images[1].alt}
//                   width={220}
//                   height={250}
//                   className="object-cover w-full h-auto rounded-lg"
//                 />
//                 <p className="absolute text-white text-xs sm:text-sm p-2 rounded-md max-w-[85%] font-serif break-words overflow-hidden text-ellipsis">
//                   {data.images[1].text}
//                 </p>
//               </div>

 

//               {/* Image 3 */}
//               <div className="relative flex items-center justify-center">
//                 <Image
//                   src={data.images[2].src}
//                   alt={data.images[2].alt}
//                   width={220}
//                   height={240}
//                   className="object-cover w-full h-auto rounded-lg"
//                 />
//                 <p className="absolute text-white text-xs sm:text-sm p-2 rounded-md max-w-[85%] font-serif break-words overflow-hidden text-ellipsis">
//                   {data.images[2].text}
//                 </p>
//               </div>

//               {/* Image 4 */}
//                <div className="relative flex items-center justify-center">
//                 <Image
//                   src={data.images[3].src}
//                   alt={data.images[3].alt}
//                   width={220}
//                   height={240}
//                   className="object-cover w-full h-auto rounded-lg"
//                 />
//                 <p className="absolute text-white text-xs sm:text-sm p-2 rounded-md max-w-[85%] font-serif break-words overflow-hidden text-ellipsis">
//                   {data.images[3].text}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Challenge;