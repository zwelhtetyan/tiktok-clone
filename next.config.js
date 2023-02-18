/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  cacheStartUrl: false,
  dynamicStartUrl: true,
  runtimeCaching: [],
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
});

module.exports = nextConfig;
