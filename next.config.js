const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
if (!cloudName) {
  throw new Error("CLOUDINARY_CLOUD_NAME environment variable is not set");
}

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
    path: `https://res.cloudinary.com/${cloudName}/image/upload`,
  },
};
