import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // export the frontend as static files for S3 / CloudFront
  output: "export",
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;