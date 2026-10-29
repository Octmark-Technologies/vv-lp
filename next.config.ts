import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  cacheComponents: true,
  async redirects() {
    return [
      // The subdomain home opens LP1; old /lp/ paths (used while the pages lived on the main site) keep working.
      { source: "/", destination: "/570-homes/", permanent: false },
      { source: "/lp/skyvue-570-homes/", destination: "/570-homes/", permanent: true },
      { source: "/lp/skyvue-pay-5-percent/", destination: "/pay-5-percent/", permanent: true },
      { source: "/lp/skyvue-70ft-above/", destination: "/70ft-above/", permanent: true },
      { source: "/lp/skyvue-builder-proof/", destination: "/builder-proof/", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
