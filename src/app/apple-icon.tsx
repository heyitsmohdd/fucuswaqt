import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0e1710',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="9"  r="8" fill="#85AB8B" />
          <circle cx="23" cy="16" r="8" fill="#85AB8B" />
          <circle cx="16" cy="23" r="8" fill="#85AB8B" />
          <circle cx="9"  cy="16" r="8" fill="#85AB8B" />
          <circle cx="16" cy="16" r="4" fill="#336443" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
