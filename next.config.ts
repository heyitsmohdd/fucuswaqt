import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sounds/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              // Default: only allow same-origin
              "default-src 'self'",
              // Scripts: self + inline (for Next.js)
              `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://www.youtube.com https://va.vercel-scripts.com`,
              // Styles: self + inline (for styled-jsx, emotion, etc.)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self + data URLs + external sources
              "img-src 'self' data: blob: https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://i.ytimg.com",
              // Media (audio/video): self + blob
              "media-src 'self' blob: https://assets.mixkit.co https://d8j0ntlcm91z4.cloudfront.net",
              // Frames: YouTube embeds
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
              // Connect: API calls
              "connect-src 'self' https://focuswaqt.space https://www.focuswaqt.space https://accounts.google.com https://oauth2.googleapis.com https://va.vercel-scripts.com https://d8j0ntlcm91z4.cloudfront.net",
              // Form actions
              "form-action 'self' https://accounts.google.com",
              // Base URI
              "base-uri 'self'",
              // Object sources (disable plugins)
              "object-src 'none'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
