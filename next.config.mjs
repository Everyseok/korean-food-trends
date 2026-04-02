/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'placehold.co' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'ldb-phinf.pstatic.net' },
      { hostname: 'streetviewpixels-pa.googleapis.com' },
      { hostname: '*.pstatic.net' },
      { protocol: 'https', hostname: '*.naver.net' },
    ],
  },
};

export default nextConfig;
