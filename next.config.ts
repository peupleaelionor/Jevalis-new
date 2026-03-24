import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma", "jspdf"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  // Ensure serverless functions have enough memory for PDF generation
  serverRuntimeConfig: {
    maxDuration: 30,
  },
};

export default nextConfig;
