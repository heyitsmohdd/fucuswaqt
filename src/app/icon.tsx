import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 4 colored quarter-circle segments — clockwise from top */}

          {/* Top-right — orange */}
          <path d="M 16 16 L 16 3 A 13 13 0 0 1 29 16 Z" fill="#FF6B35" />

          {/* Bottom-right — purple */}
          <path d="M 16 16 L 29 16 A 13 13 0 0 1 16 29 Z" fill="#A78BFA" />

          {/* Bottom-left — teal */}
          <path d="M 16 16 L 16 29 A 13 13 0 0 1 3 16 Z" fill="#2DD4BF" />

          {/* Top-left — amber */}
          <path d="M 16 16 L 3 16 A 13 13 0 0 1 16 3 Z" fill="#FBBF24" />

          {/* White center dot */}
          <circle cx="16" cy="16" r="4.5" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
