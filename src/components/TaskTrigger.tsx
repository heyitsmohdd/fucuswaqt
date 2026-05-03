'use client';

import { useState, useRef, useCallback } from 'react';
import { Flag } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

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
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
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
          0%   { opacity: 0; transform: translateY(8px) scale(0.88); }
          60%  { opacity: 1; transform: translateY(-3px) scale(1.03); }
          100% { opacity: 1; transform: translateY(0px) scale(1); }
        }
        @keyframes slang-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        .slang-bubble {
          animation: slang-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards,
                     slang-float 2.5s ease-in-out 0.35s infinite;
        }
      `}</style>

      <div className="relative flex flex-col items-center gap-2">
        <div
          className="relative"
          style={{ minHeight: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {isHovered && (
            <div
              key={cycleKey}
              className="slang-bubble absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-20"
            >
              <div className="px-4 py-1.5 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-lg shadow-purple-900/20">
                <span className="text-sm font-semibold text-purple-300 tracking-wide">
                  {currentSlang}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={openTaskModal}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="text-sm transition-colors duration-200 btn-press text-white/40 hover:text-white/70 flex items-center gap-1.5 group"
          >
            {activeTask ? (
              <>
                <Flag size={11} className="shrink-0 text-white/70" />
                <span className="text-white/80 font-medium max-w-[280px] truncate block">
                  {activeTask.title}
                </span>
              </>
            ) : (
              'What are you working on?'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
