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
    const backgroundUrl = currentBackgroundType === 'video'
        ? (currentVideo?.url || VIDEO_BACKGROUNDS[0].url)
        : (currentImage?.url || IMAGE_BACKGROUNDS[0].url);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            {/* Background */}
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

            {/* Content */}
            <div className="relative z-10 h-screen w-full p-6 md:p-8 flex flex-col">
                {/* Top Bar - Only Auth/Streak */}
                <div className="w-full flex justify-end items-center mb-6">
                    <div className="flex gap-3">
                        <StreakCounter />
                        <AuthButton />
                    </div>
                </div>

                {/* Stats Container - Centered Box */}
                <div className="flex-1 flex items-center justify-center overflow-visible">
                    <div className="max-w-4xl w-full">
                        {/* Close button above heading */}
                        <div className="flex justify-end mb-2">
                            <Link
                                href="/"
                                className="glass-light w-8 h-8 rounded-lg hover:bg-white/30 transition-all flex items-center justify-center text-white/80 hover:text-white group"
                                aria-label="Close stats"
                            >
                                <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </Link>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
                            Your Focus Stats
                        </h1>

                        {/* Scrollable Heatmap Container */}
                        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                            <FocusHeatmap />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
