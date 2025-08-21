import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-navigation-menu'],
  },

  // Suppress hydration warnings caused by browser extensions
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Image configuration
  images: {
    remotePatterns: [
      // Add Supabase storage domain when needed
      // {
      //   protocol: 'https',
      //   hostname: 'your-supabase-project.supabase.co',
      //   pathname: '/storage/v1/object/public/**',
      // },
    ],
  },

  // Turbopack configuration (stable in Next.js 15)
  turbopack: {
    rules: {
      // Handle SVG files with SVGR
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Output configuration
  output: 'standalone',
};

export default nextConfig;
