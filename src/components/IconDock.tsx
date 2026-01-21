'use client';

import { CloudRain, Music, Image as ImageIcon, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import Link from 'next/link';

export function IconDock() {
    const { openSoundMixer, openBackgroundPicker, toggleMusicModal } = useAppStore();

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
                    onClick={toggleMusicModal}
                    className="group relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
                    aria-label="Music"
                >
                    <Music className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                </button>

                {/* Bar Chart Icon - Stats */}
                <Link
                    href="/stats"
                    className="group relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
                    aria-label="Focus Stats"
                >
                    <BarChart3 className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                </Link>

                {/* Image Icon - Backgrounds */}
                <button
                    onClick={openBackgroundPicker}
                    className="group relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
                    aria-label="Background Switcher"
                >
                    <ImageIcon className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                </button>
            </div>
        </div>
    );
}
