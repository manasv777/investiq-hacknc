import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "img-src 'self' data: https:",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "connect-src 'self' https://api.elevenlabs.io https://nominatim.openstreetmap.org",
            "media-src 'self' blob:",
            "font-src 'self' data:",
            "frame-ancestors 'none'",
          ].join("; "),
        },
      ],
    },
  ],
  
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
