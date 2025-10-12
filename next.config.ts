import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Allow images from external sources (if needed)
  images: {
    domains: [],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: "InvestIQ",
  },
};

export default nextConfig;
