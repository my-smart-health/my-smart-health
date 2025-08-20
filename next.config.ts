import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://img.daisyui.com/images/stock/**')],
  },
};

export default nextConfig;
