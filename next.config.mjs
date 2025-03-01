/** @type {import('next').NextConfig} */
const nextConfig = {
  siteUrl: "https://juulabel.com/app",
  basePath: "/app",
  reactStrictMode: false,
  images: {
    domains: [
      "via.placeholder.com",
      "d3jwyw9rpnxu8p.cloudfront.net",
      "https://drive.google.com",
      "juulabel.s3.ap-northeast-2.amazonaws.com",
      "picsum.photos",
      "drive.google.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "juulabel.s3.ap-northeast-2.amazonaws.com",
        pathname: "member/**",
      },
    ],
  },
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Fixing the msw error (_http_common not found)
    if (isServer) {
      config.externals = [...(config.externals || []), "_http_common"];
      config.target = "node";
    }

    return config;
  },
};

export default nextConfig;
