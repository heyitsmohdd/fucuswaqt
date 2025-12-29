import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
    id: string;
    text: string;
    completed: boolean;
}

interface AppState {
    currentVideoId: string;
    currentBackgroundType: 'video' | 'image';
    currentBackgroundId: string;
    streakDays: number;
    tasks: Task[];
    currentTask: string;
    isSoundMixerOpen: boolean;
    isBackgroundPickerOpen: boolean;
    isTaskModalOpen: boolean;
    isMusicModalOpen: boolean;
    setCurrentVideo: (id: string) => void;
    setCurrentBackground: (id: string, type: 'video' | 'image') => void;
    incrementStreak: () => void;
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
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            currentVideoId: 'flowers',
            currentBackgroundType: 'video',
            currentBackgroundId: 'flowers',
            streakDays: 0,
            tasks: [],
            currentTask: '',
            isSoundMixerOpen: false,
            isBackgroundPickerOpen: false,
            isTaskModalOpen: false,
            isMusicModalOpen: false,

            setCurrentVideo: (id: string) => set({ currentVideoId: id, currentBackgroundId: id, currentBackgroundType: 'video' }),

            setCurrentBackground: (id: string, type: 'video' | 'image') => set({ currentBackgroundId: id, currentBackgroundType: type }),

            incrementStreak: () => set((state) => ({ streakDays: state.streakDays + 1 })),

            addTask: (text: string) => {
                if (text.trim()) {
                    set((state) => ({
                        tasks: [...state.tasks, {
                            id: Date.now().toString(),
                            text: text.trim(),
                            completed: false
                        }],
                        currentTask: ''
                    }));
                }
            },

            setCurrentTask: (task: string) => set({ currentTask: task }),

            toggleTask: (id: string) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, completed: !task.completed } : task
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
        }),
        {
            name: 'pomodoro-app-storage',
        }
    )
);
