/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: true,
    domains: ['thfcgfeivcyzfrqjxqzf.supabase.co'],
  },
  poweredByHeader: false,
  compress: true,
  experimental: {
    serverActions: true
  }
};

export default nextConfig;
