/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  middleware: [require("./middlewares/server-error")],
};

module.exports = nextConfig;
