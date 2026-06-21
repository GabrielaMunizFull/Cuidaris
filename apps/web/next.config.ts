import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cuidaris/ui", "@cuidaris/db", "@cuidaris/pdf"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upwwoqunwfnqpahstcdb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
