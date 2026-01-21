import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
    id: string;
    title: string;
    is_completed: boolean;
    user_id?: string;
    created_at?: string;
}

interface AppState {
    currentBackgroundType: 'video' | 'image';
    currentBackgroundId: string;
    streakDays: number;
    tasks: Task[];
    currentTask: string;
    isSoundMixerOpen: boolean;
    isBackgroundPickerOpen: boolean;
    isTaskModalOpen: boolean;
    isMusicModalOpen: boolean;
    setCurrentBackground: (id: string, type: 'video' | 'image') => void;
    incrementStreak: () => void;
    setStreak: (days: number) => void;
    addTask: (text: string) => void;
    setCurrentTask: (task: string) => void;
    toggleTask: (id: string) => void;
    removeTask: (id: string) => void;
    openSoundMixer: () => void;
    closeSoundMixer: () => void;
    openBackgroundPicker: () => void;
    closeBackgroundPicker: () => void;
    openTaskModal: () => void;
    closeTaskModal: () => void;
    openMusicModal: () => void;
    closeMusicModal: () => void;
    toggleMusicModal: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            currentBackgroundType: 'video',
            currentBackgroundId: 'catt',
            streakDays: 0,
            tasks: [],
            currentTask: '',
            isSoundMixerOpen: false,
            isBackgroundPickerOpen: false,
            isTaskModalOpen: false,
            isMusicModalOpen: false,

            setCurrentBackground: (id: string, type: 'video' | 'image') => set({ currentBackgroundId: id, currentBackgroundType: type }),

            incrementStreak: () => set((state) => ({ streakDays: state.streakDays + 1 })),

            setStreak: (days: number) => set({ streakDays: days }),

            addTask: (text: string) => {
                if (text.trim()) {
                    set((state) => ({
                        tasks: [...state.tasks, {
                            id: Date.now().toString(),
                            title: text.trim(),
                            is_completed: false
                        }],
                        currentTask: ''
                    }));
                }
            },

            setCurrentTask: (task: string) => set({ currentTask: task }),

            toggleTask: (id: string) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, is_completed: !task.is_completed } : task
                    )
                }));
            },

            removeTask: (id: string) => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id)
                }));
            },

            openSoundMixer: () => set({ isSoundMixerOpen: true }),

            closeSoundMixer: () => set({ isSoundMixerOpen: false }),

            openBackgroundPicker: () => set({ isBackgroundPickerOpen: true }),

            closeBackgroundPicker: () => set({ isBackgroundPickerOpen: false }),

            openTaskModal: () => set({ isTaskModalOpen: true }),

            closeTaskModal: () => set({ isTaskModalOpen: false }),

            openMusicModal: () => set({ isMusicModalOpen: true }),

            closeMusicModal: () => set({ isMusicModalOpen: false }),

            toggleMusicModal: () => set((state) => ({ isMusicModalOpen: !state.isMusicModalOpen })),
        }),
        {
            name: 'pomodoro-app-storage',
        }
    )
);
