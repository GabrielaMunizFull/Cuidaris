import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cuidaris/ui", "@cuidaris/db", "@cuidaris/pdf"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
