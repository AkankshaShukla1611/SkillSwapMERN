/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  allowedDevOrigins: [
    '10.29.218.70',
  ],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};