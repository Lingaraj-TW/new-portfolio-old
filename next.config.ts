import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      { source: "/prodoc", destination: "/docs" },
      { source: "/prodoc/:path*", destination: "/docs/:path*" },
    ];
  },
  async redirects() {
    return [
      {
        source: "/prodoc-platform",
        destination: "/platform",
        permanent: false,
      },
      {
        source: "/profeed-platform",
        destination: "/products/profeed",
        permanent: false,
      },
      {
        source: "/proinsights-platform",
        destination: "/products/proinsights",
        permanent: false,
      },
      {
        source: "/prostyle",
        destination: "/products/prodoc#governance",
        permanent: false,
      },
      {
        source: "/proreview",
        destination: "/products/prodoc#governance",
        permanent: false,
      },
      {
        source: "/proops",
        destination: "/products/prodoc#governance",
        permanent: false,
      },
      {
        source: "/products/prostyle",
        destination: "/products/prodoc#governance",
        permanent: false,
      },
      {
        source: "/products/proreview",
        destination: "/products/prodoc#governance",
        permanent: false,
      },
      {
        source: "/products/proops",
        destination: "/products/prodoc#governance",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
