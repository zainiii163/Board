import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  async redirects() {
    return [
      {
        source: "/:board/books",
        destination: "/:board?view=books",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "board-production-6505.up.railway.app",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
      },
    ],
  },
};

export default nextConfig;
