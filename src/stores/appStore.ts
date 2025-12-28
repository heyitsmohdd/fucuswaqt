import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    currentVideoId: string;
    streakDays: number;
    tasks: string[];
    currentTask: string;
    isSoundMixerOpen: boolean;
    setCurrentVideo: (id: string) => void;
    incrementStreak: () => void;
    addTask: (task: string) => void;
    setCurrentTask: (task: string) => void;
    removeTask: (index: number) => void;
    openSoundMixer: () => void;
    closeSoundMixer: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            currentVideoId: 'rainy-window',
            streakDays: 0,
            tasks: [],
            currentTask: '',
            isSoundMixerOpen: false,

            setCurrentVideo: (id: string) => set({ currentVideoId: id }),

            incrementStreak: () => set((state) => ({ streakDays: state.streakDays + 1 })),

            addTask: (task: string) => {
                if (task.trim()) {
                    set((state) => ({
                        tasks: [...state.tasks, task.trim()],
                        currentTask: ''
                    }));
                }
            },

            setCurrentTask: (task: string) => set({ currentTask: task }),

            removeTask: (index: number) => {
                set((state) => ({
                    tasks: state.tasks.filter((_, i) => i !== index)
                }));
            },

            openSoundMixer: () => set({ isSoundMixerOpen: true }),

            closeSoundMixer: () => set({ isSoundMixerOpen: false }),
        }),
        {
            name: 'pomodoro-app-storage',
        }
    )
);
