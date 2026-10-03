import type { NextConfig } from "next";

// Must match lib/api-client.ts so relative asset paths (book covers, uploads,
// demo PDFs) resolve against the API instead of 404ing on the Next origin.
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  async rewrites() {
    return [
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
        hostname: "board-production-6505.up.railway.app",
        port: "",
        pathname: "/**",
      },
      {
        // No `port` key: Next normalises numeric-looking port values, which then
        // fail the strict string comparison in the remote-pattern matcher.
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
