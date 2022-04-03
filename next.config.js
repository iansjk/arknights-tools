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
    loader: "cloudinary",
    path: "https://res.cloudinary.com/samidare/image/upload",
  },
};
