/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  trailingSlash: true,
  assetPrefix: '.',
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    domains: [
      "bjorn66.com",
      "kaily-p.binayt.pro",
      "admin.kaily-p.com",
      "cf.cjdropshipping.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  
  // ❌ أزل هذا القسم بالكامل
  // experimental: {
  //   serverActions: {
  //     allowedOrigins: ["*"],
  //   },
  // },
  
  staticPageGenerationTimeout: 300,
};

module.exports = nextConfig;