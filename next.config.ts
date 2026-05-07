import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/icon': ['./public/pong.jpeg'],
    '/apple-icon': ['./public/pong.jpeg'],
  },
};

export default nextConfig;
