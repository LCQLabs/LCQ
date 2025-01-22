/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable TypeScript type checking for production builds
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  
  // Configure ESLint to run during builds
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  
  // Add security headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  
  // Image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lcq.gg',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/LCQLabs/**',
      },
    ],
  },
  
  // API rewrites and redirects
  async rewrites() {
    return [
      {
        source: '/api/mcp/:path*',
        destination: '/api/proxy/mcp/:path*',
      },
    ];
  },
  
  // Environment variables that should be exposed to the browser
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  
  // Webpack configuration to handle special files/modules
  webpack(config) {
    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  
  // Feature flags based on environment variables
  publicRuntimeConfig: {
    features: {
      transactionOptimizer: process.env.NEXT_PUBLIC_ENABLE_TRANSACTION_OPTIMIZER === 'true',
      programDeployment: process.env.NEXT_PUBLIC_ENABLE_PROGRAM_DEPLOYMENT === 'true',
      accountAnalyzer: process.env.NEXT_PUBLIC_ENABLE_ACCOUNT_ANALYZER === 'true',
      smartContractAuditor: process.env.NEXT_PUBLIC_ENABLE_SMART_CONTRACT_AUDITOR === 'true',
      dataScraper: process.env.NEXT_PUBLIC_ENABLE_DATA_SCRAPER === 'true',
    },
    maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
  },
  
  // Server-only runtime config
  serverRuntimeConfig: {
    mcpApiKey: process.env.MCP_API_KEY,
    mcpEndpointId: process.env.MCP_ENDPOINT_ID,
    solanaRpcUrl: process.env.SOLANA_RPC_URL,
    solanaNetwork: process.env.SOLANA_NETWORK,
  },
  
  // Limit page generation to specific paths in production (if using SSG)
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Configure trailing slash behavior
  trailingSlash: false,
};

module.exports = nextConfig;