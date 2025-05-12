import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { 
        hostname: 'smiley-snapcast.b-cdn.net', 
        protocol: 'https', 
        port: '', 
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ]
  },
};

export default nextConfig;
