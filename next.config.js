/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/arknights",
        permanent: false,
      },
      {
        source: "/arknights",
        destination: "/arknights/planner",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // set minimumCacheTTL to 7 days
    minimumCacheTTL: 604800,
  },
};
