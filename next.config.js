/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "img.icons8.com",
      "unsplash.com",
      "placekitten.com",
      "picsum.photos",
    ],
  },
};

module.exports = nextConfig;
