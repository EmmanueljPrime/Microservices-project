import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: ['@radix-ui/react-icons'],
    },
    compiler: {
        removeConsole: false,
    },
};

export default nextConfig;
