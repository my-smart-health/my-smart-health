import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.daisyui.com',
        pathname: '/images/stock/**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
        pathname: '/**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.blob.vercel-storage.com',
        pathname: '/**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
        pathname: '/**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'www.instagram.com',
        pathname: '/**',
        port: '',
      },
    ],
  },
};

export default nextConfig;
