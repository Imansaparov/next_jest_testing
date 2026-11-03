import type { NextConfig } from 'next';

import path from 'node:path';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Minimal self-contained server in .next/standalone for the Docker image.
  output: 'standalone',
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
