'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useTimerStore } from '@/stores/timerStore';
import { useAppStore } from '@/stores/appStore';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateStreak } from '@/actions/updateStreak';
import { updateDailyFocus } from '@/actions/updateDailyFocus';
import { TIMER_PRESETS } from '@/constants';
import { TimerSettingsModal } from './TimerSettingsModal';

export function Timer() {
    const { isRunning, timeLeft, mode, currentPreset, customDurations, startTimer, pauseTimer, resetTimer, tick, switchMode } = useTimerStore();
    const { setStreak } = useAppStore();
    const streakUpdatedRef = useRef(false);
    const [showSettings, setShowSettings] = useState(false);

    // Countdown interval
    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => { tick(); }, 1000);
        return () => clearInterval(interval);
    }, [isRunning, tick]);

    // Reset streak flag when mode or running state changes
    useEffect(() => {
        streakUpdatedRef.current = false;
    }, [mode, isRunning]);

    // Handle session complete
    useEffect(() => {
        const handleSessionComplete = async () => {
            if (timeLeft === 0 && mode === 'focus' && !streakUpdatedRef.current) {
                streakUpdatedRef.current = true;
                try {
                    const result = await updateStreak();
                    if (result.success && result.profile) {
                        setStreak(result.profile.current_streak);
                    }
                    const preset = currentPreset === 'custom' ? customDurations : TIMER_PRESETS[currentPreset];
                    await updateDailyFocus(preset.focus);
                } catch { /* silently handle */ }
            }
        };
        handleSessionComplete();
    }, [timeLeft, mode, setStreak, currentPreset, customDurations]);

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

    // Progress bar calculation
    const totalSeconds = useMemo(() => {
        const preset = currentPreset === 'custom' ? customDurations : TIMER_PRESETS[currentPreset];
        const modeKey = mode === 'focus' ? 'focus' : mode === 'break' ? 'break' : 'longBreak';
        return preset[modeKey] * 60;
    }, [mode, currentPreset, customDurations]);

    const progress = totalSeconds > 0 ? timeLeft / totalSeconds : 1;

    // Split into individual digits for per-digit animation
    const d0 = Math.floor(minutes / 10);
    const d1 = minutes % 10;
    const d2 = Math.floor(seconds / 10);
    const d3 = seconds % 10;

    return (
        <>
            <div className="flex flex-col items-center gap-7">
                {/* Mode Pills */}
                <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10">
                    {(['focus', 'break', 'longBreak'] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => switchMode(m)}
                            className={cn(
                                'px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                                mode === m
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-white/50 hover:text-white/80'
                            )}
                            aria-label={`Switch to ${m === 'focus' ? 'focus' : m === 'break' ? 'short break' : 'long break'} mode`}
                        >
                            {m === 'focus' ? 'Focus' : m === 'break' ? 'Break' : 'Long'}
                        </button>
                    ))}
                </div>

                {/* Timer Display — individual digits with entrance animation */}
                <div
                    className="font-bold text-white leading-none tracking-tight select-none tabular-nums"
                    style={{ fontSize: 'clamp(5rem, 14vw, 10rem)' }}
                    aria-live="polite"
                    aria-atomic="true"
                    role="timer"
                    aria-label={`${minutes} minutes and ${seconds} remaining`}
                >
                    <span key={`d0-${d0}`} className="inline-block animate-digit-in">{d0}</span>
                    <span key={`d1-${d1}`} className="inline-block animate-digit-in">{d1}</span>
                    <span className="inline-block opacity-50 mx-0.5 md:mx-1">:</span>
                    <span key={`d2-${d2}`} className="inline-block animate-digit-in">{d2}</span>
                    <span key={`d3-${d3}`} className="inline-block animate-digit-in">{d3}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-48 md:w-64 h-px bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white/40 rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${progress * 100}%` }}
                    />
                </div>

                {/* Controls */}
                <div className="flex gap-3 items-center">
                    {/* Reset */}
                    <button
                        onClick={resetTimer}
                        className="glass-light w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/20 transition-all btn-press"
                        aria-label="Reset timer"
                    >
                        <RotateCcw className="w-5 h-5 text-white/70" />
                    </button>

                    {/* Play / Pause — primary, slightly larger */}
                    <button
                        onClick={isRunning ? pauseTimer : startTimer}
                        className={cn(
                            'w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center transition-all btn-press',
                            isRunning
                                ? 'bg-white/20 hover:bg-white/30 ring-2 ring-white/25 shadow-lg shadow-white/10'
                                : 'bg-white/12 hover:bg-white/20 border border-white/15'
                        )}
                        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
                    >
                        {isRunning ? (
                            <Pause className="w-7 h-7 text-white" />
                        ) : (
                            <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                        )}
                    </button>

                    {/* Settings */}
                    <button
                        onClick={() => setShowSettings(true)}
                        className="glass-light w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/20 transition-all btn-press"
                        aria-label="Timer settings"
                    >
                        <Settings className="w-5 h-5 text-white/70" />
                    </button>
                </div>
            </div>

            <TimerSettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </>
    );
}
