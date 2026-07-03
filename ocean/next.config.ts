import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatars
      { protocol: "https", hostname: "avatars.githubusercontent.com" }, // GitHub avatars
      { protocol: "https", hostname: "utfs.io" }, // UploadThing
      { protocol: "https", hostname: "*.ufs.sh" }, // UploadThing (newer)
    ],
  },
};

export default nextConfig;
