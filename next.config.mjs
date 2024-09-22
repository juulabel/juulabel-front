/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "via.placeholder.com",
      "juulabel.s3.ap-northeast-2.amazonaws.com",
    ],
   remotePatterns: [
    {
      protocol: "https",
      hostname: "juulabel.s3.ap-northeast-2.amazonaws.com",
      port: "",
      pathname: "member/**",
    },
  ],
  },
  experimental: {
    instrumentationHook: true,
  },
  
  webpack: (config, {isServer}) => {    
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // fixing the msw error (_http_common not found)
    if (isServer) {
      config.externals = [...(config.externals || []), '_http_common'];
      config.target = 'node';
    }

    return config;
  },
};
export default nextConfig;
