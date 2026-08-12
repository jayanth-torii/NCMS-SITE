import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    domains: [
      "ncms-web.s3.ap-south-1.amazonaws.com", 
      "ncms-web.s3-accelerate.amazonaws.com",  
      "s3.ap-south-1.amazonaws.com"
    ]
  },

};

export default nextConfig;
