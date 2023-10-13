/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'commons.wikimedia.org',
        port: '',
        pathname: '**/*',
      },
    ],
  },
}

module.exports = nextConfig
