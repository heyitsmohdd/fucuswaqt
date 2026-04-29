import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TIMER_PRESETS, type TimerPresetKey, type TimerPreset } from '@/constants';

type TimerMode = 'focus' | 'break' | 'longBreak';

interface TimerSettings {
    currentPreset: TimerPresetKey;
    customDurations: TimerPreset;
}

interface TimerState {
    isRunning: boolean;
    timeLeft: number;
    mode: TimerMode;
    completedSessions: number;
    // Settings
    currentPreset: TimerPresetKey;
    customDurations: TimerPreset;
    // Actions
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: () => void;
    tick: () => void;
    switchMode: (mode: TimerMode) => void;
    setPreset: (preset: TimerPresetKey) => void;
    setCustomDurations: (durations: Partial<TimerPreset>) => void;
    getDuration: (mode: TimerMode) => number;
}

const DEFAULT_CUSTOM: TimerPreset = {
    focus: 25,
    break: 5,
    longBreak: 15,
    label: 'Custom',
};

export const useTimerStore = create<TimerState>()(
    persist(
        (set, get) => ({
            isRunning: false,
            timeLeft: 25 * 60, // 25 minutes default
            mode: 'focus',
            completedSessions: 0,
            currentPreset: 'short',
            customDurations: DEFAULT_CUSTOM,

            getDuration: (mode: TimerMode) => {
                const { currentPreset, customDurations } = get();
                const preset = currentPreset === 'custom'
                    ? customDurations
                    : TIMER_PRESETS[currentPreset];

                switch (mode) {
                    case 'focus': return preset.focus * 60;
                    case 'break': return preset.break * 60;
                    case 'longBreak': return preset.longBreak * 60;
                }
            },

            startTimer: () => set({ isRunning: true }),

            pauseTimer: () => set({ isRunning: false }),

            resetTimer: () => {
                const { mode, getDuration } = get();
                set({
                    timeLeft: getDuration(mode),
                    isRunning: false
                });
            },

            tick: () => {
                const { timeLeft, isRunning, mode, completedSessions } = get();

                if (!isRunning || timeLeft <= 0) return;

                const newTimeLeft = timeLeft - 1;

                if (newTimeLeft <= 0) {
                    set({
                        timeLeft: 0,
                        isRunning: false,
                        completedSessions: mode === 'focus' ? completedSessions + 1 : completedSessions
                    });

                    // Play notification sound
                    if (typeof window !== 'undefined') {
                        const audio = new Audio('/notification.mp3');
                        audio.play().catch(() => { });
                    }
                } else {
                    set({ timeLeft: newTimeLeft });
                }
            },

            switchMode: (mode: TimerMode) => {
                const { getDuration } = get();
                set({
                    mode,
                    timeLeft: getDuration(mode),
                    isRunning: false
                });
            },

            setPreset: (preset: TimerPresetKey) => {
                const { mode } = get();
                const durations = preset === 'custom'
                    ? get().customDurations
                    : TIMER_PRESETS[preset];

                const newTimeLeft = mode === 'focus'
                    ? durations.focus * 60
                    : mode === 'break'
                        ? durations.break * 60
                        : durations.longBreak * 60;

                set({
                    currentPreset: preset,
                    timeLeft: newTimeLeft,
                    isRunning: false
                });
            },

            setCustomDurations: (durations: Partial<TimerPreset>) => {
                const { customDurations, mode, currentPreset } = get();
                const updated = { ...customDurations, ...durations };

                const updates: Partial<TimerState> = {
                    customDurations: updated,
                };

                // If custom is active, also update timeLeft
                if (currentPreset === 'custom') {
                    updates.timeLeft = mode === 'focus'
                        ? updated.focus * 60
                        : mode === 'break'
                            ? updated.break * 60
                            : updated.longBreak * 60;
                    updates.isRunning = false;
                }

                set(updates);
            },
        }),
        {
            name: 'timer-settings',
            partialize: (state) => ({
                currentPreset: state.currentPreset,
                customDurations: state.customDurations,
            }),
        }
    )
);
