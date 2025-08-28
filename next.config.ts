import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://img.daisyui.com/images/stock/**'),
      new URL('https://nlj4slf2dv4x65qm.public.blob.vercel-storage.com/**'),
    ],
  },
};

export default nextConfig;
