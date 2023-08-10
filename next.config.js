/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["cloud.appwrite.io", "appwrite.local.terabits.io"],
  },
};

module.exports = nextConfig;
