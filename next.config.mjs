/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["d3fhc8hmbgwz4k.cloudfront.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
