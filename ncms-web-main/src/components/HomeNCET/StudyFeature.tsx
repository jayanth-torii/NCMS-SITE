"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import highlight from "./highlight";

// "Education & Excellence for Everyone" — programme cards from department-banners.
const DEFAULT_ARTICLES = [
  { id: 1, title: "Commerce & Management", image: "/images/commerce_5fbfbe6b6f.png", link: "/departments", content: "UG programme in Commerce and Management with hands-on, industry-ready learning." },
  { id: 2, title: "Computer Application", image: "/images/computer_application_7c0d78aae4.png", link: "/departments", content: "BCA programme blending computing fundamentals with real-world application." },
  { id: 3, title: "Science", image: "/images/science_143f59c7a3.png", link: "/departments", content: "B.Sc programmes with expert faculty and research-driven coursework." },
  { id: 4, title: "MBA", image: "/images/mba_3ae07dd399.png", link: "/departments", content: "Masters in Business Administration focused on leadership and strategy." },
  { id: 5, title: "Masters of Computer Application", image: "/images/mca_90deef87b1.png", link: "/departments", content: "MCA programme equipping students for careers in software development." },
  { id: 6, title: "Masters of Commerce", image: "/images/moc_a7783bdc09.png", link: "/departments", content: "M.Com programme with advanced accounting, finance and taxation." },
];

const StudyFeature = ({ data, banners }: { data?: any; banners?: any }) => {
  const { heading, description } = data || {};
  const bannerMap: Record<string, { title: string; image: string }> = banners || {};
  const articles = [
    { id: 1, title: "Commerce & Management", image: bannerMap.UG_Commerce?.image, link: "/departments", content: "UG programme in Commerce and Management with hands-on, industry-ready learning." },
    { id: 2, title: "Computer Application", image: bannerMap.UG_CA?.image, link: "/departments", content: "BCA programme blending computing fundamentals with real-world application." },
    { id: 3, title: "Science", image: bannerMap.Science?.image, link: "/departments", content: "B.Sc programmes with expert faculty and research-driven coursework." },
    { id: 4, title: "MBA", image: bannerMap.MBA?.image, link: "/departments", content: "Masters in Business Administration focused on leadership and strategy." },
    { id: 5, title: "MCA", image: bannerMap.MCA?.image, link: "/departments", content: "MCA programme equipping students for careers in software development." },
    { id: 6, title: "M.Com", image: bannerMap.MOC?.image, link: "/departments", content: "M.Com programme with advanced accounting, finance and taxation." },
  ].map((a) => ({ ...a, image: a.image || DEFAULT_ARTICLES.find((d) => d.id === a.id)?.image }));

  return (
    <section className="study-ed" aria-labelledby="study-ed-title">
      <div className="container">
        <div className="section-head-ed section-head-ed--on-dark">
          <span className="eyebrow-ed eyebrow-ed--on-dark">Why study here</span>
          <h2 id="study-ed-title" className="heading-ed heading-ed--on-dark">
            {highlight(heading, "Everyone")}
          </h2>
          <p className="section-sub-ed section-sub-ed--on-dark">{description}</p>
        </div>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          speed={700}
          loop={true}
          spaceBetween={26}
          slidesPerView={1}
          breakpoints={{ 600: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
        >
          {articles.map((article) => (
            <SwiperSlide key={article.id}>
              <article className="study-ed__card">
                <div className="study-ed__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={article.image} alt={article.title} loading="lazy" />
                </div>
                <div className="study-ed__body">
                  <h3 className="study-ed__title">{article.title}</h3>
                  <p className="study-ed__text">{article.content}</p>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default StudyFeature;
