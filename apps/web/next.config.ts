import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The monorepo root (two levels up), where the shared lockfile and node_modules live.
  // Pinned so lockfiles in folders above the repo aren't picked up.
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
