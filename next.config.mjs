import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ldb-phinf.pstatic.net' },
      { protocol: 'https', hostname: 'ssl.pstatic.net' },
      { protocol: 'https', hostname: 'map.pstatic.net' },
      { protocol: 'https', hostname: 'streetviewpixels-pa.googleapis.com' },
      // NAVER CDN domains — add more as enrichment discovers them
      { protocol: 'https', hostname: '*.pstatic.net', pathname: '/**' },
      { protocol: 'https', hostname: '*.naver.net', pathname: '/**' },
    ],
  },
};

export default nextConfig;
