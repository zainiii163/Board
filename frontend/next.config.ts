import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "board-production-6505.up.railway.app",
      },
    ],
  },
};

export default nextConfig;
