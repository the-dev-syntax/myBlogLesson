/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/the-dev-syntax/next-dave-final-project/main/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
