import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/blog';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface OGImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OGImage({ params }: OGImageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? 'FocusWaqt Blog';
  const description = post?.description ?? 'Thoughts on deep work and focus.';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0e0b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(51,100,67,0.25) 0%, transparent 70%)',
            top: -100,
            right: -100,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="9"  r="8" fill="#85AB8B" opacity="0.9" />
            <circle cx="23" cy="16" r="8" fill="#85AB8B" opacity="0.9" />
            <circle cx="16" cy="23" r="8" fill="#85AB8B" opacity="0.9" />
            <circle cx="9"  cy="16" r="8" fill="#85AB8B" opacity="0.9" />
            <circle cx="16" cy="16" r="4" fill="#336443" />
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18, letterSpacing: '-0.3px' }}>
            FocusWaqt Blog
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 500,
              color: '#e8f0e9',
              letterSpacing: '-1.5px',
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '-0.3px',
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            fontSize: 16,
            color: 'rgba(133,171,139,0.6)',
            letterSpacing: '0.3px',
          }}
        >
          focuswaqt.space/blog
        </div>
      </div>
    ),
    { ...size }
  );
}
