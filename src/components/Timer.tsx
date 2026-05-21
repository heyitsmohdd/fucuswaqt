'use client';

import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { useShortcutHint } from '@/hooks/useShortcutHint';
import { useTimerStore } from '@/stores/timerStore';
import { useAppStore } from '@/stores/appStore';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { updateStreak } from '@/actions/updateStreak';
import { updateDailyFocus } from '@/actions/updateDailyFocus';
import { TIMER_PRESETS } from '@/constants';

export function Timer() {
    const { isRunning, timeLeft, mode, currentPreset, customDurations, startTimer, pauseTimer, resetTimer, tick, switchMode } = useTimerStore();
    const { openTimerSettings, setStreak } = useAppStore();
    const streakUpdatedRef = useRef(false);
    const prevTimeLeftRef = useRef(timeLeft);
    const [pendingMode, setPendingMode] = useState<'focus' | 'break' | 'longBreak' | null>(null);
    const spaceHint = useShortcutHint('hint-space', 'Press Space to play');
    const resetHint = useShortcutHint('hint-r', 'Press R to reset');
    const handlePlayPause = useCallback(() => {
        isRunning ? pauseTimer() : startTimer();
        spaceHint.trigger();
    }, [isRunning, startTimer, pauseTimer, spaceHint]);

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
                } catch {
                    toast.error('Session saved locally — sync failed. Check your connection.');
                }
            }
        };
        handleSessionComplete();
    }, [timeLeft, mode, setStreak, currentPreset, customDurations]);

    // Session complete toast + browser notification
    useEffect(() => {
        if (prevTimeLeftRef.current > 0 && timeLeft === 0) {
            const isFocus = mode === 'focus';
            const title = isFocus ? 'Focus session complete! 🎉' : 'Break over!';
            const body = isFocus ? 'Great work. Take a break.' : 'Ready to focus again?';

            if (isFocus) toast.success(title, { description: body });
            else toast(title, { description: body });

            if (Notification.permission === 'granted') {
                new Notification(title, { body, icon: '/icon.png' });
            }
        }
        prevTimeLeftRef.current = timeLeft;
    }, [timeLeft, mode]);

    useEffect(() => {
        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Update document title
    useEffect(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const modeText = mode === 'focus' ? 'Focus' : mode === 'break' ? 'Break' : 'Long Break';
        const nextTitle = isRunning ? `(${timeString}) ${modeText}` : `Pomodoro Timer - ${modeText}`;
        if (document.title !== nextTitle) document.title = nextTitle;
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

    const handleModeSwitch = (m: 'focus' | 'break' | 'longBreak') => {
        if (m === mode) return;
        if (timeLeft < totalSeconds && timeLeft > 0) {
            setPendingMode(m);
        } else {
            switchMode(m);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center gap-7">
                {/* Mode Dots */}
                <div className="flex items-center gap-3">
                    {(['focus', 'break', 'longBreak'] as const).map((m) => {
                        const labels = { focus: 'Focus', break: 'Break', longBreak: 'Long' };
                        const isActive = mode === m;
                        return (
                            <div key={m} className="group relative flex flex-col items-center">
                                <span className={cn(
                                    'absolute -top-6 text-[10px] font-medium text-white/50 whitespace-nowrap transition-all duration-200',
                                    isActive
                                        ? 'opacity-0'
                                        : 'opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5'
                                )}>
                                    {labels[m]}
                                </span>
                                <button
                                    onClick={() => handleModeSwitch(m)}
                                    className={cn(
                                        'h-2.5 rounded-full transition-all duration-300 overflow-hidden flex items-center justify-center',
                                        isActive
                                            ? cn('w-14', {
                                                'bg-white': m === 'focus',
                                                'bg-emerald-400': m === 'break',
                                                'bg-sky-400': m === 'longBreak',
                                              })
                                            : 'bg-white/25 hover:bg-white/50 w-2.5'
                                    )}
                                    aria-label={`Switch to ${m === 'focus' ? 'focus' : m === 'break' ? 'short break' : 'long break'} mode`}
                                >
                                    {isActive && (
                                        <span className={cn('text-[9px] font-bold whitespace-nowrap', m === 'focus' ? 'text-black/70' : 'text-white/90')}>
                                            {labels[m]}
                                        </span>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Timer Display */}
                <div
                    key={mode}
                    className="animate-digit-in font-bold text-white leading-none tracking-tight select-none tabular-nums"
                    style={{ fontSize: 'clamp(5rem, 14vw, 10rem)' }}
                    aria-live="polite"
                    aria-atomic="true"
                    role="timer"
                    aria-label={`${minutes} minutes and ${seconds} remaining`}
                >
                    {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
                </div>

                {/* Progress Bar */}
                <div className="relative w-48 md:w-64">
                    <div className="h-px bg-white/10 rounded-full w-full" />
                    <div
                        className="absolute top-0 left-0 h-px bg-white/40 rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${progress * 100}%` }}
                    />
                    {isRunning && (
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white transition-all duration-1000 ease-linear"
                            style={{
                                left: `calc(${progress * 100}% - 3px)`,
                                boxShadow: '0 0 8px 3px rgba(255,255,255,0.55)',
                            }}
                        />
                    )}
                </div>

                {/* Controls */}
                <div className="flex gap-3 items-center">
                    {/* Reset */}
                    <div className="relative">
                        {resetHint.visible && (
                            <kbd className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white/15 border border-white/20 rounded-lg text-white/70 text-[11px] font-mono whitespace-nowrap pointer-events-none animate-fade-in">
                                R
                            </kbd>
                        )}
                        <button
                            onClick={() => { resetTimer(); resetHint.trigger(); }}
                            className="glass-light w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/20 transition-all btn-press group"
                            aria-label="Reset timer"
                        >
                            <RotateCcw className="w-5 h-5 text-white/70 transition-transform duration-500 group-hover:-rotate-180" />
                        </button>
                    </div>

                    {/* Play / Pause — primary, slightly larger */}
                    <div className="relative w-[4.5rem] h-[4.5rem] flex items-center justify-center">
                        {spaceHint.visible && (
                            <kbd className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white/15 border border-white/20 rounded-lg text-white/70 text-[11px] font-mono whitespace-nowrap pointer-events-none animate-fade-in">
                                Space
                            </kbd>
                        )}
                        <button
                            onClick={handlePlayPause}
                            className={cn(
                                'group w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center transition-all btn-press',
                                isRunning
                                    ? 'bg-white/20 hover:bg-white/30 ring-2 ring-white/25 shadow-lg shadow-white/10'
                                    : 'bg-white/12 hover:bg-white/20 border border-white/15'
                            )}
                            aria-label={isRunning ? 'Pause timer' : 'Start timer'}
                        >
                            {isRunning ? (
                                <Pause className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-90" />
                            ) : (
                                <Play className="w-7 h-7 text-white fill-white ml-0.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-110" />
                            )}
                        </button>
                    </div>

                    {/* Settings */}
                    <button
                        onClick={openTimerSettings}
                        className="glass-light w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/20 transition-all btn-press group"
                        aria-label="Timer settings"
                    >
                        <Settings className="w-5 h-5 text-white/70 transition-transform duration-700 group-hover:rotate-90" />
                    </button>
                </div>
            </div>

            {pendingMode && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <style>{`
                        .nb-cancel:hover { background: rgba(212,237,216,0.06) !important; }
                        .nb-switch:hover { transform: translateY(2px) !important; box-shadow: none !important; }
                        .nb-switch:active { transform: translateY(3px) !important; box-shadow: none !important; }
                    `}</style>
                    <div
                        className="animate-scale-in w-full"
                        style={{
                            maxWidth: 360,
                            background: '#0A0A0A',
                            border: '1px solid rgba(255,255,255,0.15)',
                            boxShadow: 'none',
                            borderRadius: 0,
                            padding: 28,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                        }}
                    >
                        <div style={{
                            width: 52, height: 52,
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(212,237,216,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 16, fontSize: '1.5rem',
                        }}>
                            🥺
                        </div>

                        <h3 style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', marginBottom: 8 }}>
                            Hold on!
                        </h3>
                        <p style={{ color: '#FFFFFF', opacity: 0.55, fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.55, marginBottom: 24 }}>
                            You&apos;re mid-session. Switching now loses current progress.
                        </p>

                        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                            <button
                                onClick={() => setPendingMode(null)}
                                className="nb-cancel"
                                style={{
                                    flex: 1, padding: '10px 0',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    background: '#0A0A0A',
                                    color: '#FFFFFF',
                                    fontWeight: 700, fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    transition: 'background 0.12s',
                                    borderRadius: 0,
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (pendingMode) {
                                        switchMode(pendingMode);
                                        setPendingMode(null);
                                    }
                                }}
                                className="nb-switch"
                                style={{
                                    flex: 1, padding: '10px 0',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    background: '#D4EDD8',
                                    boxShadow: 'none',
                                    color: '#0A0A0A',
                                    fontWeight: 700, fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    transition: 'transform 0.07s ease, box-shadow 0.07s ease',
                                    borderRadius: 0,
                                }}
                            >
                                Switch anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
