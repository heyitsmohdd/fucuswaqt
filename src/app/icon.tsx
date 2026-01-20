import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: '100%', height: '100%', background: '#1a1a1a' }}
      >
        <path d="M4.5 3h15" />
        <path d="M4.5 21h15" />
        <path d="M6 3v4.2c0 .53.21 1.04.59 1.41L12 14l5.41-5.39c.38-.37.59-.88.59-1.41V3" />
        <path d="M6 21v-4.2c0-.53.21-1.04.59-1.41L12 10l5.41 5.39c.38.37.59.88.59 1.41V21" />
        <circle cx="12" cy="12" r="1" fill="#ffffff" />
      </svg>
    ),
    { ...size }
  );
}
