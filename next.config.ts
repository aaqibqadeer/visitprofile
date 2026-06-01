import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Next.js 16 supports the `new URL()` shorthand for remote image patterns.
    // The hero portrait is a placeholder hosted on Unsplash.
    remotePatterns: [new URL("https://images.unsplash.com/**")],
  },
};

export default nextConfig;
