/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/jobs", destination: "/talents" },
    ];
  },
};

export default nextConfig;
