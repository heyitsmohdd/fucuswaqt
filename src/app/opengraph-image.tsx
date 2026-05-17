import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'FocusWaqt — Deep focus, every single day';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0e1710',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(51,100,67,0.35) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Clover icon */}
        <div style={{ display: 'flex', marginBottom: 32 }}>
          <svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="9"  r="8" fill="#85AB8B" opacity="0.9" />
            <circle cx="23" cy="16" r="8" fill="#85AB8B" opacity="0.9" />
            <circle cx="16" cy="23" r="8" fill="#85AB8B" opacity="0.9" />
            <circle cx="9"  cy="16" r="8" fill="#85AB8B" opacity="0.9" />
            <circle cx="16" cy="16" r="4" fill="#336443" />
          </svg>
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 300,
            color: '#c5dfc8',
            letterSpacing: '-3px',
            lineHeight: 1,
            marginBottom: 20,
          }}
        >
          FocusWaqt
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: '#85AB8B',
            letterSpacing: '-0.5px',
            marginBottom: 48,
          }}
        >
          Deep focus, every single day
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['Pomodoro Timer', 'Streak Tracking', 'Ambient Sounds', 'Free Forever'].map(label => (
            <div
              key={label}
              style={{
                background: 'rgba(133,171,139,0.12)',
                border: '1px solid rgba(133,171,139,0.25)',
                borderRadius: 999,
                padding: '8px 18px',
                fontSize: 16,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 18,
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.5px',
          }}
        >
          focuswaqt.space
        </div>
      </div>
    ),
    { ...size }
  );
}
