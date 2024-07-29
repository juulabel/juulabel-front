/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["via.placeholder.com"],
  },
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
