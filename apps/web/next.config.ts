import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cuidaris/ui", "@cuidaris/db", "@cuidaris/pdf"],
};

export default nextConfig;
