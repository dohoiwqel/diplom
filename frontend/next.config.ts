import { BACKEND_URL } from "@/app/constants";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['logo.moralis.io'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3333',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
