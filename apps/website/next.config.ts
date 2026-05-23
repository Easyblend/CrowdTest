import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this app so Next/Turbopack don't walk up
  // past `apps/` looking for a package.json (which breaks module resolution
  // for things like `tailwindcss`).
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
