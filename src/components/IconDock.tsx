'use client';

import { CloudRain, Music, Image } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

export function IconDock() {
    const { openSoundMixer, openBackgroundPicker, openMusicModal } = useAppStore();

    return (
        <div className="fixed bottom-6 left-6 z-20">
            <div className="glass-light rounded-2xl px-3 py-2 flex items-center gap-3">
                {/* Cloud Rain Icon - Sound Mixer */}
                <button
                    onClick={openSoundMixer}
                    className="group relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
                    aria-label="Sound Mixer"
                >
                    <CloudRain className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                </button>

                {/* Music Note Icon */}
                <button
                    onClick={openMusicModal}
                    className="group relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
                    aria-label="Music"
                >
                    <Music className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                </button>

                {/* Image Icon - Backgrounds */}
                <button
                    onClick={openBackgroundPicker}
                    className="group relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
                    aria-label="Background Switcher"
                >
                    <Image className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                </button>
            </div>
        </div>
    );
}
