import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactCompiler: false,
    poweredByHeader: false,
    images: {
        // ✅ Disable Image Optimization to preserve original quality
        unoptimized: true,
    },
    compress: true,
    experimental: {
        // Optimize CSS
        optimizePackageImports: ['@fortawesome/react-fontawesome'],
    },
};

export default nextConfig;
