/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/landing-page',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/landing-page',
  },
};

export default nextConfig;
