/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Deactivate in production if necessary

  experimental: {
    optimizeCss: true, // Minifica CSS
  },

  images: {
    domains: ["d3fhc8hmbgwz4k.cloudfront.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = "cheap-module-source-map";
    }
    return config;
  },
};

export default nextConfig;
