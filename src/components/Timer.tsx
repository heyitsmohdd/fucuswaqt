'use client';

import { useEffect, useRef, useMemo, useCallback  } from 'react';
import { useTimerStore } from '@/stores/timerStore';
import { useAppStore } from '@/stores/appStore';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
// import { updateStreak } from '@/actions/updateStreak';        // Supabase paused
// import { updateDailyFocus } from '@/actions/updateDailyFocus'; // Supabase paused
import { TIMER_PRESETS } from '@/constants';

export function Timer() {
    const { isRunning, timeLeft, mode, currentPreset, customDurations, startTimer, pauseTimer, resetTimer, tick, switchMode } = useTimerStore();
    const { openTimerSettings } = useAppStore();
    const streakUpdatedRef = useRef(false);
    const prevTimeLeftRef = useRef(timeLeft);
    const handlePlayPause = useCallback(() => {
        isRunning ? pauseTimer() : startTimer();
    }, [isRunning, startTimer, pauseTimer]);

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

    // Supabase paused — streak/focus tracking disabled
    // useEffect(() => {
    //     const handleSessionComplete = async () => {
    //         if (timeLeft === 0 && mode === 'focus' && !streakUpdatedRef.current) {
    //             streakUpdatedRef.current = true;
    //             try {
    //                 const result = await updateStreak();
    //                 if (result.success && result.profile) {
    //                     setStreak(result.profile.current_streak);
    //                 }
    //                 const preset = currentPreset === 'custom' ? customDurations : TIMER_PRESETS[currentPreset];
    //                 await updateDailyFocus(preset.focus);
    //             } catch { /* silently handle */ }
    //         }
    //     };
    //     handleSessionComplete();
    // }, [timeLeft, mode, setStreak, currentPreset, customDurations]);

    // Session complete toast
    useEffect(() => {
        if (prevTimeLeftRef.current > 0 && timeLeft === 0) {
            if (mode === 'focus') {
                toast.success('Focus session complete!', { description: 'Great work. Take a break.' });
            } else {
                toast('Break over!', { description: 'Ready to focus again?' });
            }
        }
        prevTimeLeftRef.current = timeLeft;
    }, [timeLeft, mode]);

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
                                    onClick={() => switchMode(m)}
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
                    <button
                        onClick={resetTimer}
                        className="glass-light w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/20 transition-all btn-press group"
                        aria-label="Reset timer"
                    >
                        <RotateCcw className="w-5 h-5 text-white/70 transition-transform duration-500 group-hover:-rotate-180" />
                    </button>

                    {/* Play / Pause — primary, slightly larger */}
                    <div className="relative w-[4.5rem] h-[4.5rem] flex items-center justify-center">
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

        </>
    );
}
