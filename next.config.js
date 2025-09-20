/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  // 정적 파일 서빙을 위한 설정
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: "/public/images/:path*",
      },
      {
        source: "/videos/:path*",
        destination: "/public/videos/:path*",
      },
    ];
  },
  // 환경 변수 설정
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Vite의 define 기능과 유사한 설정
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
