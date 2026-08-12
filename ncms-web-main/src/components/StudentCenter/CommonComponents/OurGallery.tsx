import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Image from "next/image";

interface OurGalleryProps {
  StudentCenterData: {
    images: string[];
    title:string
  };
}

const OurGallery = ({ StudentCenterData }: OurGalleryProps) => {
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

      <h1 className="text-2xl md:text-3xl text-[#003333] font-bold mb-6 text-left">
        {StudentCenterData.title}
      </h1>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {StudentCenterData?.images?.map((image: string, index: number) => (
          <div key={index} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/2 lg:w-1/2 snap-start">
            {/* Responsive, shorter cards on larger screens */}
            <div className="relative overflow-hidden rounded-lg shadow-lg
                            aspect-[4/3] lg:aspect-video">
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                priority={index < 2}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => handleScroll("left")}
        aria-label="Scroll left"
        className="shadow-md cursor-pointer absolute left-2 top-1/2 bg-white bg-opacity-70 p-1 md:p-3 rounded-full transition"
      >
         <FaArrowLeft size={20} className="text-[#003333] cursor-pointer"/>
      </button>
      <button
        onClick={() => handleScroll("right")}
        aria-label="Scroll right"
        className="shadow-md cursor-pointer absolute right-2 top-1/2 bg-white bg-opacity-70 p-1 md:p-3 rounded-full transition"
      >
        <FaArrowRight size={20} className="text-[#003333] cursor-pointer"/>
      </button>
    </div>
  );
}
export default OurGallery;