import type { NextConfig } from "next";

// Local `next dev` only — production routing is in root vercel.json services rewrites.
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "*.asse.devtunnels.ms"],
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${API}/api/:path*` },
      { source: "/backend-api/:path*", destination: `${API}/:path*` },
      { source: "/book-covers/:path*", destination: `${API}/book-covers/:path*` },
      { source: "/uploads/:path*", destination: `${API}/uploads/:path*` },
      { source: "/demo-pdfs/:path*", destination: `${API}/demo-pdfs/:path*` },
    ];
  },
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
    // The optimizer refuses upstreams that resolve to private IPs. Locally the
    // API is on http://localhost:4000, so dev needs this; production stays strict.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "board-production-6505.up.railway.app",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
