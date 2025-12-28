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
            {/* Mode Indicators - Dots */}
            <div className="flex gap-3 items-center">
                <button
                    onClick={() => switchMode('focus')}
                    className={cn(
                        'w-3 h-3 rounded-full transition-all',
                        mode === 'focus'
                            ? 'bg-white'
                            : 'bg-white/30 hover:bg-white/50'
                    )}
                    aria-label="Focus mode"
                    title="Focus"
                />
                <button
                    onClick={() => switchMode('break')}
                    className={cn(
                        'w-3 h-3 rounded-full transition-all',
                        mode === 'break'
                            ? 'bg-white'
                            : 'bg-white/30 hover:bg-white/50'
                    )}
                    aria-label="Short break mode"
                    title="Short Break"
                />
                <button
                    onClick={() => switchMode('longBreak')}
                    className={cn(
                        'w-3 h-3 rounded-full transition-all',
                        mode === 'longBreak'
                            ? 'bg-white'
                            : 'bg-white/30 hover:bg-white/50'
                    )}
                    aria-label="Long break mode"
                    title="Long Break"
                />
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
