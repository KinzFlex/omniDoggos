/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.io"],
    loader: "akamai",
    path: "",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "export",
};

module.exports = nextConfig;
