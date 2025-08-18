import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-navigation-menu'],
  },

  // Turbopack configuration (now stable)
  turbopack: {
    rules: {
      // Handle SVG files
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Webpack configuration (fallback for non-turbopack builds)
  webpack: (config, { dev, isServer }) => {
    // Only apply webpack config when not using turbopack
    if (!process.env.TURBOPACK) {
      if (!dev && !isServer) {
        config.resolve.alias = {
          ...config.resolve.alias,
          punycode: false,
        };
      }

      // Ignore deprecation warnings
      config.ignoreWarnings = [
        { module: /node_modules\/punycode/ },
        { file: /node_modules\/punycode/ },
      ];
    }

    return config;
  },

  // Output configuration
  output: 'standalone',
};

export default nextConfig;
