/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/landing-page',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/landing-page',
  },
};

export default nextConfig;
