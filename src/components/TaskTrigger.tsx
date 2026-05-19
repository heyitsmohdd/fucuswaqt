'use client';

import { useState, useRef, useCallback } from 'react';
import { Flag } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

const INK = '#0D2118';
const SAGE = '#85AB8B';

const SLANG_NO_TASK = [
  "what's the mission today? 🎯",
  "no task? that's wild 👀",
  "add something, king 👑",
  "idle mode detected 😴",
  "the grind needs a goal 🔥",
  "what we cookin today? 🍳",
];

const SLANG_HAS_TASK = [
  "locked in fr fr 🔒",
  "absolutely cooking rn 🍳",
  "built different today ⚡",
  "in the zone, no cap 🧠",
  "big brain mode on 💜",
  "grind never stops 💪",
  "we are so back 🚀",
];

export function TaskTrigger() {
  const { openTaskModal, tasks } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlang, setCurrentSlang] = useState('');
  const [cycleKey, setCycleKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const usedRef = useRef<Set<string>>(new Set());

  const activeTask = tasks.find(task => !task.is_completed);

  const pickSlang = useCallback((pool: string[]) => {
    const unused = pool.filter(s => !usedRef.current.has(s));
    const next = unused.length ? unused : pool;
    if (!unused.length) usedRef.current.clear();
    const picked = next[Math.floor(Math.random() * next.length)];
    usedRef.current.add(picked);
    return picked;
  }, []);

  const handleMouseEnter = () => {
    const pool = activeTask ? SLANG_HAS_TASK : SLANG_NO_TASK;
    usedRef.current.clear();
    const first = pickSlang(pool);
    setCurrentSlang(first);
    setCycleKey(k => k + 1);
    setIsHovered(true);

    intervalRef.current = setInterval(() => {
      const next = pickSlang(pool);
      setCurrentSlang(next);
      setCycleKey(k => k + 1);
    }, 2000);
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setIsHovered(false);
  };

  return (
    <>
      <style>{`
        @keyframes slang-in {
          0%   { opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.88); }
          60%  { opacity: 1; transform: translateX(-50%) translateY(-3px) scale(1.03); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1); }
        }
        @keyframes slang-float {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50%       { transform: translateX(-50%) translateY(-4px); }
        }
        .slang-bubble {
          animation: slang-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards,
                     slang-float 2.5s ease-in-out 0.35s infinite;
        }
        .task-trigger-btn:hover { transform: translateY(1px) !important; box-shadow: 1px 1px 0px ${INK} !important; }
        .task-trigger-btn:active { transform: translateY(2px) !important; box-shadow: 0px 0px 0px ${INK} !important; }
      `}</style>

      <div className="relative flex flex-col items-center gap-2">
        <div
          style={{ minHeight: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
        >
          {isHovered && (
            <div
              key={cycleKey}
              className="slang-bubble"
              style={{
                position: 'absolute', top: -48, left: '50%',
                whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 20,
              }}
            >
              <div style={{
                padding: '6px 14px',
                background: '#FFFFFF',
                border: `2px solid ${INK}`,
                boxShadow: `2px 2px 0px ${INK}`,
                borderRadius: 8,
              }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: SAGE }}>
                  {currentSlang}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={openTaskModal}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="task-trigger-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 16px',
              background: 'rgba(255,255,255,0.92)',
              border: `2px solid ${INK}`,
              boxShadow: `2px 2px 0px ${INK}`,
              borderRadius: 999,
              cursor: 'pointer',
              transition: 'transform 0.07s ease, box-shadow 0.07s ease',
              maxWidth: 320,
            }}
          >
            {activeTask ? (
              <>
                <Flag style={{ width: 11, height: 11, color: SAGE, flexShrink: 0 }} />
                <span style={{
                  color: INK, fontSize: '0.875rem', fontWeight: 700,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {activeTask.title}
                </span>
              </>
            ) : (
              <span style={{ color: INK, fontSize: '0.875rem', fontWeight: 600, opacity: 0.55 }}>
                What are you working on?
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
