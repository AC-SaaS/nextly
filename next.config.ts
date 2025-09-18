import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "logos-world.net", // optional, in case you grab more logos later
      },
      {
        protocol: "https",
        hostname: "seeklogo.com", // optional
      },
    ],
  },
  /* config options here */
  // eslint: {
  //   ignoreDuringBuilds: true,
  // }
};

export default nextConfig;
