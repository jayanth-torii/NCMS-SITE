"use client"
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
 

const SamsthithaActivities = ({data}:any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isUserScrolling) return;

    const autoScroll = () => {
      if (!scrollContainer) return;

      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (scrollContainer.scrollLeft >= maxScroll) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollBy({ left: scrollContainer.clientWidth / 2, behavior: "smooth" });
      }
    };

    const interval = setInterval(autoScroll, 3000);

    return () => clearInterval(interval);
  }, [isUserScrolling]);

  const handleScroll = (direction: "left" | "right") => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    setIsUserScrolling(true);
    const scrollDistance = scrollContainer.clientWidth / 2;

    if (direction === "left") {
      scrollContainer.scrollBy({ left: -scrollDistance, behavior: "smooth" });
    } else {
      scrollContainer.scrollBy({ left: scrollDistance, behavior: "smooth" });
    }

    setTimeout(() => setIsUserScrolling(false), 3000);
  }

  return (
    <div className="relative mb-10 md:mb-20">

      <h1 className="text-2xl md:text-3xl text-[#003333] font-bold mb-6 text-left"> {data?.title} </h1>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scrollbar-hide scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {data?.activities?.map(
          (activity: { image: string; title: string }, index: number) => (
            <div
              key={index}
              className="p-2 space-y-3 flex-shrink-0 w-full sm:w-1/2 md:w-1/2 lg:w-1/2"
            >
              <img
                src={activity?.image}
                alt={`Image ${index + 1}`}
                className="w-full h-72 rounded-lg shadow-lg object-cover"
              />
              <p className="text-[#003333] text-justify break-words">{activity?.title}</p>
            </div>
          )
        )}
      </div>


      <button
        onClick={() => handleScroll("left")}
        className="absolute cursor-pointer bg-white left-0 top-1/2 transform -translate-y-1/2 bg-opacity-50 p-3 rounded-full transition duration-300 text-white"
      >
         <FaArrowLeft size={20} className="text-[#003333]"/>
      </button>
      <button
        onClick={() => handleScroll("right")}
        className="absolute cursor-pointer right-0 bg-white top-1/2 transform -translate-y-1/2  bg-opacity-50 p-3 rounded-full  transition duration-300 text-white"
      >
        <FaArrowRight size={20} className="text-[#003333]"/>
      </button>
    </div>
  );
}
export default SamsthithaActivities