// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    poweredByHeader: false,
    compress: true,
    images: {
        formats: ['image/avif', 'image/webp'],
    },
};

module.exports = nextConfig;
