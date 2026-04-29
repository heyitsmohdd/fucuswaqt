'use client';

// import { FocusHeatmap } from '@/components/FocusHeatmap'; // Supabase paused
// import { StreakCounter } from '@/components/StreakCounter'; // Supabase paused
// import { AuthButton } from '@/components/AuthButton';       // Supabase paused
import { BackgroundVideo } from '@/components/BackgroundVideo';
import { useAppStore } from '@/stores/appStore';
import { VIDEO_BACKGROUNDS, IMAGE_BACKGROUNDS } from '@/constants';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function StatsPage() {
    const { currentBackgroundId, currentBackgroundType } = useAppStore();

    const currentVideo = VIDEO_BACKGROUNDS.find(v => v.id === currentBackgroundId);
    const currentImage = IMAGE_BACKGROUNDS.find(i => i.id === currentBackgroundId);
    const backgroundUrl = currentBackgroundType === 'video'
        ? (currentVideo?.url || VIDEO_BACKGROUNDS[0].url)
        : (currentImage?.url || IMAGE_BACKGROUNDS[0].url);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            {currentBackgroundType === 'video' ? (
                <BackgroundVideo videoUrl={backgroundUrl} />
            ) : (
                <>
                    <div
                        className="fixed inset-0 w-full h-full bg-cover bg-center z-0"
                        style={{ backgroundImage: `url(${backgroundUrl})` }}
                    />
                    <div className="fixed inset-0 bg-black/30 z-[1]" />
                </>
            )}

            <div className="relative z-10 h-screen w-full p-6 md:p-8 flex flex-col items-center justify-center">
                <div className="flex justify-end w-full max-w-4xl mb-4">
                    <Link
                        href="/"
                        className="glass-light w-8 h-8 rounded-lg hover:bg-white/30 transition-all flex items-center justify-center text-white/80 hover:text-white group"
                        aria-label="Close stats"
                    >
                        <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </Link>
                </div>

                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Focus Stats</h1>
                    <p className="text-white/40 text-sm">Stats will be available once the database is back online.</p>
                </div>
            </div>
        </div>
    );
}
