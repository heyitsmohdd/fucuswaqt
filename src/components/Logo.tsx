'use client';

import { useTimerStore } from '@/stores/timerStore';

export function Logo() {
  const { isRunning } = useTimerStore();

  return (
    <>
      <style>{`
        @keyframes clover-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes clover-glow {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(133,171,139,0.3)); }
          50%       { filter: drop-shadow(0 0 8px rgba(133,171,139,0.75)); }
        }
        @keyframes petal-wave {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }

        .clover-spin {
          animation: clover-spin 20s linear infinite;
          transform-origin: center;
          display: flex;
        }
        .clover-svg { animation: clover-glow 4s ease-in-out infinite; }
        .p1 { animation: petal-wave 3s ease-in-out infinite; animation-delay: 0s; }
        .p2 { animation: petal-wave 3s ease-in-out infinite; animation-delay: 0.75s; }
        .p3 { animation: petal-wave 3s ease-in-out infinite; animation-delay: 1.5s; }
        .p4 { animation: petal-wave 3s ease-in-out infinite; animation-delay: 2.25s; }

        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&display=swap');
        .logo-outer { transition: transform 0.25s ease; cursor: default; }
        .logo-outer:hover { transform: scale(1.12); }
        .logo-outer:hover .clover-spin { animation-duration: 1.5s; }
        .logo-outer:hover .clover-svg { filter: drop-shadow(0 0 10px rgba(133,171,139,0.9)); }
      `}</style>

      <div
        className="flex items-center gap-2 select-none transition-all duration-500"
        style={{ opacity: isRunning ? 0 : 1, pointerEvents: isRunning ? 'none' : 'auto' }}
      >
        <div className="logo-outer">
          <div className="clover-spin">
            <svg
              className="clover-svg"
              width="28"
              height="28"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle className="p1" cx="16" cy="9"  r="8" fill="#85AB8B" />
              <circle className="p2" cx="23" cy="16" r="8" fill="#85AB8B" />
              <circle className="p3" cx="16" cy="23" r="8" fill="#85AB8B" />
              <circle className="p4" cx="9"  cy="16" r="8" fill="#85AB8B" />
              <circle cx="16" cy="16" r="4" fill="#336443" />
            </svg>
          </div>
        </div>

        <span
          className="drop-shadow"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800, fontSize: '1.05rem',
            letterSpacing: '-0.04em', color: 'white',
          }}
        >
          FocusWaqt
        </span>
      </div>
    </>
  );
}
