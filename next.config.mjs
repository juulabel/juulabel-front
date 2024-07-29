/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["via.placeholder.com"],
  },
  experimental: {
    instrumentationHook: true,
  },
  domains: ["juulabel.s3.ap-northeast-2.amazonaws.com"],
  // 추후 pathname 경로에 맞게 수정
  remotePatterns: [
    {
      protocol: "https",
      hostname: "juulabel.s3.ap-northeast-2.amazonaws.com",
      port: "",
      pathname: "member/**",
    },
  ],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};
export default nextConfig;
