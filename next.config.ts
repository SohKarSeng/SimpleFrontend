import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/submit.php',
        destination: 'http://localhost:8080/submit.php',
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
