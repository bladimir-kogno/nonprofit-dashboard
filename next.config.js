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
        unoptimized: true, // Required for static export
    },
    // Configure for Firebase Hosting static export
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
    // Disable server-side features for static export
    experimental: {
        esmExternals: 'loose',
    },
};

module.exports = nextConfig;
