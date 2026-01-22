'use client';

import { useEffect, useRef, useState } from 'react';
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

        const interval = setInterval(() => {
            tick();
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, tick]);

    // Reset the streak update flag when timer is reset or mode changes
    useEffect(() => {
        streakUpdatedRef.current = false;
    }, [mode, isRunning]);

    // Handle streak update and focus tracking when session completes
    useEffect(() => {
        const handleSessionComplete = async () => {
            // Only trigger once when:
            // 1. Timer hits 0
            // 2. Mode is 'focus'
            // 3. Haven't already updated streak for this session
            if (timeLeft === 0 && mode === 'focus' && !streakUpdatedRef.current) {
                streakUpdatedRef.current = true; // Mark as updated

                try {
                    // Update streak
                    const result = await updateStreak();
                    if (result.success && result.profile) {
                        setStreak(result.profile.current_streak);
                    }

                    // Record focus time in heatmap (use actual preset duration)
                    const preset = currentPreset === 'custom' ? customDurations : TIMER_PRESETS[currentPreset];
                    const focusMinutes = preset.focus;
                    await updateDailyFocus(focusMinutes);
                } catch {
                    // Silently handle errors
                }
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

    return (
        <>
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
                    className="text-[8rem] md:text-[10rem] font-bold text-white leading-none tracking-tight"
                    aria-live="polite"
                    aria-atomic="true"
                    role="timer"
                    aria-label={`${minutes} minutes and ${seconds} remaining`}
                >
                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    <button
                        onClick={isRunning ? pauseTimer : startTimer}
                        className="glass-light p-6 rounded-full hover:bg-white/20 transition-all"
                        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
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
                        aria-label="Reset timer"
                    >
                        <RotateCcw className="w-8 h-8 text-white" />
                    </button>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="glass-light p-6 rounded-full hover:bg-white/20 transition-all"
                        aria-label="Timer settings"
                    >
                        <Settings className="w-8 h-8 text-white" />
                    </button>
                </div>
            </div>

            {/* Settings Modal */}
            <TimerSettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </>
    );
}
