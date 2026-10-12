import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root so lockfiles in parent folders aren't picked up
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
