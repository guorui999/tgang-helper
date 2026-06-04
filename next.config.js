/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // Headers not needed for static export (handled by Capacitor)
};

module.exports = nextConfig;
