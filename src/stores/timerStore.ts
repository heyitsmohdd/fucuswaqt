import { create } from 'zustand';
import { TIMER_DEFAULTS } from '@/constants';

type TimerMode = 'focus' | 'break' | 'longBreak';

interface TimerState {
    isRunning: boolean;
    timeLeft: number;
    mode: TimerMode;
    completedSessions: number;
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: () => void;
    tick: () => void;
    switchMode: (mode: TimerMode) => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
    isRunning: false,
    timeLeft: TIMER_DEFAULTS.FOCUS_DURATION,
    mode: 'focus',
    completedSessions: 0,

    startTimer: () => set({ isRunning: true }),

    pauseTimer: () => set({ isRunning: false }),

    resetTimer: () => {
        const { mode } = get();
        const duration =
            mode === 'focus' ? TIMER_DEFAULTS.FOCUS_DURATION :
                mode === 'break' ? TIMER_DEFAULTS.BREAK_DURATION :
                    TIMER_DEFAULTS.LONG_BREAK_DURATION;

        set({
            timeLeft: duration,
            isRunning: false
        });
    },

    tick: () => {
        const { timeLeft, isRunning, mode, completedSessions } = get();

        if (!isRunning || timeLeft <= 0) return;

        const newTimeLeft = timeLeft - 1;

        if (newTimeLeft <= 0) {
            // Timer completed
            set({
                isRunning: false,
                completedSessions: mode === 'focus' ? completedSessions + 1 : completedSessions
            });

            // Play notification sound (optional)
            if (typeof window !== 'undefined') {
                const audio = new Audio('/notification.mp3');
                audio.play().catch(() => { });
            }
        } else {
            set({ timeLeft: newTimeLeft });
        }
    },

    switchMode: (mode: TimerMode) => {
        const duration =
            mode === 'focus' ? TIMER_DEFAULTS.FOCUS_DURATION :
                mode === 'break' ? TIMER_DEFAULTS.BREAK_DURATION :
                    TIMER_DEFAULTS.LONG_BREAK_DURATION;

        set({
            mode,
            timeLeft: duration,
            isRunning: false
        });
    },
}));
