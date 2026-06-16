'use client';

import { FocusHeatmap } from '@/components/FocusHeatmap';
import { StreakCounter } from '@/components/StreakCounter';
import { AuthButton } from '@/components/AuthButton';
import { BackgroundVideo } from '@/components/BackgroundVideo';
import { useAppStore } from '@/stores/appStore';
import { VIDEO_BACKGROUNDS, IMAGE_BACKGROUNDS } from '@/constants';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function StatsPage() {
    const { currentBackgroundId, currentBackgroundType } = useAppStore();

    const currentVideo = VIDEO_BACKGROUNDS.find(v => v.id === currentBackgroundId);
    const currentImage = IMAGE_BACKGROUNDS.find(i => i.id === currentBackgroundId);
    const resolvedVideo = currentVideo ?? VIDEO_BACKGROUNDS[0];
    const backgroundUrl = currentBackgroundType === 'video'
        ? resolvedVideo.url
        : (currentImage?.url ?? IMAGE_BACKGROUNDS[0].url);
    const backgroundPoster = currentBackgroundType === 'video' ? resolvedVideo.thumbnail : undefined;

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            {currentBackgroundType === 'video' ? (
                <BackgroundVideo videoUrl={backgroundUrl} posterUrl={backgroundPoster} />
            ) : (
                <>
                    <div
                        className="fixed inset-0 w-full h-full bg-cover bg-center z-0"
                        style={{ backgroundImage: `url(${backgroundUrl})` }}
                    />
                    <div className="fixed inset-0 bg-black/30 z-[1]" />
                </>
            )}

            <div className="relative z-10 h-screen w-full p-6 md:p-8 flex flex-col">
                <div className="flex justify-between items-center w-full max-w-4xl mx-auto mb-6">
                    <div className="flex items-center gap-2">
                        <StreakCounter />
                    </div>
                    <div className="flex items-center gap-3">
                        <AuthButton />
                        <Link
                            href="/"
                            className="glass-light w-8 h-8 rounded-lg hover:bg-white/30 transition-all flex items-center justify-center text-white/80 hover:text-white group"
                            aria-label="Close stats"
                        >
                            <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto gap-6">
                    <div className="w-full">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Focus Stats</h1>
                        <FocusHeatmap />
                    </div>
                </div>
            </div>
        </div>
    );
}
