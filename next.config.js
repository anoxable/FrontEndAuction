/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['auctionbay.s3.eu-central-1.amazonaws.com'],
  },
}

module.exports = nextConfig
