"use client";

const AboutSamsthitha = ({data}:any) => {
    if (!data) return null;  
    const { title, points } = data;

    return (
        <div className="w-full p-8 bg-[#F9F9F9] text-[#003333] mb-10 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
                {title}
            </h2>
            {points?.map((para:any, index:any) => (
                <p key={index} className="text-justify leading-relaxed mb-4">
                    {para}
                </p>
            ))}
        </div>
    );
};

export default AboutSamsthitha;
