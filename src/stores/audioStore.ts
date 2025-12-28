import { create } from 'zustand';

interface AudioState {
    activeTracks: Set<string>;
    volumes: Map<string, number>;
    toggleTrack: (id: string) => void;
    setVolume: (id: string, volume: number) => void;
    isTrackActive: (id: string) => boolean;
    getVolume: (id: string) => number;
}

export const useAudioStore = create<AudioState>((set, get) => ({
    activeTracks: new Set<string>(),
    volumes: new Map<string, number>(),

    toggleTrack: (id: string) => {
        set((state) => {
            const newActiveTracks = new Set(state.activeTracks);

            if (newActiveTracks.has(id)) {
                newActiveTracks.delete(id);
            } else {
                newActiveTracks.add(id);
            }

            return { activeTracks: newActiveTracks };
        });
    },

    setVolume: (id: string, volume: number) => {
        set((state) => {
            const newVolumes = new Map(state.volumes);
            newVolumes.set(id, volume);
            return { volumes: newVolumes };
        });
    },

    isTrackActive: (id: string) => {
        return get().activeTracks.has(id);
    },

    getVolume: (id: string) => {
        return get().volumes.get(id) ?? 0.5; // Default volume 50%
    },
}));
