import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  siteUrl: "https://juulabel.com/app",
  basePath: "/app",
  reactStrictMode: false,
  images: {    
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "juulabel.s3.ap-northeast-2.amazonaws.com",        
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

    if (isServer) {
      config.externals = [...(config.externals || []), "_http_common"];
      config.target = "node";
    }
    return config;
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,  
  disable: process.env.NODE_ENV === 'development',
  scope: '/app',
  sw: 'sw.js',     
})(nextConfig);
