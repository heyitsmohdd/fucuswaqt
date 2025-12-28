import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    currentVideoId: string;
    streakDays: number;
    tasks: string[];
    currentTask: string;
    setCurrentVideo: (id: string) => void;
    incrementStreak: () => void;
    addTask: (task: string) => void;
    setCurrentTask: (task: string) => void;
    removeTask: (index: number) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            currentVideoId: 'rainy-window',
            streakDays: 0,
            tasks: [],
            currentTask: '',

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
        }),
        {
            name: 'pomodoro-app-storage',
        }
    )
);
