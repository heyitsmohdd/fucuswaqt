'use client';

import { useEffect } from 'react';
import { useTimerStore } from '@/stores/timerStore';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Timer() {
    const { isRunning, timeLeft, mode, startTimer, pauseTimer, resetTimer, tick, switchMode } = useTimerStore();

    // Countdown interval
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            tick();
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, tick]);

    // Update document title
    useEffect(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const modeText = mode === 'focus' ? 'Focus' : mode === 'break' ? 'Break' : 'Long Break';
        document.title = isRunning ? `(${timeString}) ${modeText}` : `Pomodoro Timer - ${modeText}`;
    }, [timeLeft, isRunning, mode]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="flex flex-col items-center gap-8">
            {/* Mode Switcher */}
            <div className="flex gap-2">
                <button
                    onClick={() => switchMode('focus')}
                    className={cn(
                        'px-6 py-2 rounded-full text-sm font-medium transition-all',
                        mode === 'focus'
                            ? 'glass-light text-white'
                            : 'text-gray-400 hover:text-white'
                    )}
                >
                    Focus
                </button>
                <button
                    onClick={() => switchMode('break')}
                    className={cn(
                        'px-6 py-2 rounded-full text-sm font-medium transition-all',
                        mode === 'break'
                            ? 'glass-light text-white'
                            : 'text-gray-400 hover:text-white'
                    )}
                >
                    Short Break
                </button>
                <button
                    onClick={() => switchMode('longBreak')}
                    className={cn(
                        'px-6 py-2 rounded-full text-sm font-medium transition-all',
                        mode === 'longBreak'
                            ? 'glass-light text-white'
                            : 'text-gray-400 hover:text-white'
                    )}
                >
                    Long Break
                </button>
            </div>

            {/* Timer Display */}
            <div
                className={cn(
                    'text-[8rem] md:text-[10rem] font-bold text-white leading-none tracking-tight',
                    isRunning && 'pulse-glow'
                )}
            >
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onClick={isRunning ? pauseTimer : startTimer}
                    className="glass-light p-6 rounded-full hover:bg-white/20 transition-all"
                >
                    {isRunning ? (
                        <Pause className="w-8 h-8 text-white" />
                    ) : (
                        <Play className="w-8 h-8 text-white" />
                    )}
                </button>
                <button
                    onClick={resetTimer}
                    className="glass-light p-6 rounded-full hover:bg-white/20 transition-all"
                >
                    <RotateCcw className="w-8 h-8 text-white" />
                </button>
            </div>
        </div>
    );
}
