import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              // Default: only allow same-origin
              "default-src 'self'",
              // Scripts: self + inline (for Next.js) + eval (for dev)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://va.vercel-scripts.com",
              // Styles: self + inline (for styled-jsx, emotion, etc.)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self + data URLs + external sources
              "img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://i.ytimg.com",
              // Media (audio/video): self + blob
              "media-src 'self' blob: https://assets.mixkit.co",
              // Frames: YouTube embeds
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
              // Connect: API calls
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://va.vercel-scripts.com",
              // Form actions
              "form-action 'self'",
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
