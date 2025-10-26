/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  trailingSlash: true,
  assetPrefix: '.',
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
  eslint: {
    ignoreDuringBuilds: true, // ✅ تجاهل تحذيرات ESLint وقت الـ Build
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
  staticPageGenerationTimeout: 300,
};

module.exports = nextConfig;
