import type { NextConfig } from "next";

// Define the Next.js configuration object
const nextConfig: NextConfig = {
  // Your Next.js configuration options can go here
  reactStrictMode: true, // Example option

  // Custom server port setup
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000, // Use PORT from env or default to 3000
  },
};

export default nextConfig;
