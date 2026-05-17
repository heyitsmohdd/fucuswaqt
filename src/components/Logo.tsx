'use client';

import { useState } from 'react';
import { useTimerStore } from '@/stores/timerStore';

const LETTERS = 'FocusWaqt'.split('');

interface ScatterVal { x: number; y: number; r: number; }

const generateScatter = (): ScatterVal => ({
  x: (Math.random() - 0.5) * 90,
  y: (Math.random() - 0.5) * 60,
  r: (Math.random() - 0.5) * 50,
});

export function Logo() {
  const { isRunning } = useTimerStore();
  const [isScattered, setIsScattered] = useState(false);
  const [scatterVals, setScatterVals] = useState<ScatterVal[]>(() => LETTERS.map(generateScatter));

  const handleMouseEnter = () => {
    setScatterVals(LETTERS.map(generateScatter));
    setIsScattered(true);
  };

  const handleMouseLeave = () => {
    setIsScattered(false);
  };

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

        .logo-outer { transition: transform 0.25s ease; cursor: default; }
        .logo-outer:hover { transform: scale(1.12); }
        .logo-outer:hover .clover-spin { animation-duration: 1.5s; }
        .logo-outer:hover .clover-svg {
          filter: drop-shadow(0 0 10px rgba(133,171,139,0.9));
        }

        .letter-out {
          transition: transform 0.65s ease-out, opacity 0.5s ease-out;
        }
        .letter-in {
          transition: transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease;
        }
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
          className="font-semibold text-lg drop-shadow flex"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {LETTERS.map((char, i) => (
            <span
              key={i}
              className={isScattered ? 'letter-out' : 'letter-in'}
              style={{
                display: 'inline-block',
                transform: isScattered
                  ? `translate(${scatterVals[i].x}px, ${scatterVals[i].y}px) rotate(${scatterVals[i].r}deg)`
                  : 'translate(0,0) rotate(0deg)',
                opacity: isScattered ? 0 : 1,
                transitionDelay: isScattered
                  ? `${i * 30}ms`
                  : `${(LETTERS.length - 1 - i) * 25}ms`,
                color: 'white',
              }}
            >
              {char}
            </span>
          ))}
        </span>
      </div>
    </>
  );
}
