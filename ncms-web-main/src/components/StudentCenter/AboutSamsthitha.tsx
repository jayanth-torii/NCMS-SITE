"use client";

const AboutSamsthitha = ({ data }: any) => {
  if (!data) return null;
  const { title, points } = data;

  return (
    <div className="sc-about">
      <div className="sc-about__head">
        <span className="sc-eyebrow">Alumni Association</span>
        <h2 className="sc-about__title">{title || "About Samsthitha"}</h2>
      </div>
      <div className="sc-about__body">
        {(points || []).map((para: string, index: number) => (
          <div key={index} className="sc-about__point">
            <span className="sc-about__num">{String(index + 1).padStart(2, "0")}</span>
            <p style={{ margin: 0 }}>{para}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutSamsthitha;
