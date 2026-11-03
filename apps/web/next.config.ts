import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@ui-library/ui'],
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
