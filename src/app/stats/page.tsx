'use client';

import { FocusHeatmap } from '@/components/FocusHeatmap';
import { StreakCounter } from '@/components/StreakCounter';
import { AuthButton } from '@/components/AuthButton';
import { BackgroundVideo } from '@/components/BackgroundVideo';
import { useAppStore } from '@/stores/appStore';
import { VIDEO_BACKGROUNDS, IMAGE_BACKGROUNDS } from '@/constants';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function StatsPage() {
    const { currentBackgroundId, currentBackgroundType } = useAppStore();

    const currentVideo = VIDEO_BACKGROUNDS.find(v => v.id === currentBackgroundId);
    const currentImage = IMAGE_BACKGROUNDS.find(i => i.id === currentBackgroundId);
    const backgroundUrl = currentBackgroundType === 'video'
        ? (currentVideo?.url || VIDEO_BACKGROUNDS[0].url)
        : (currentImage?.url || IMAGE_BACKGROUNDS[0].url);

    return (
        <div className="relative min-h-screen w-screen overflow-auto">
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
            <div className="relative z-10 min-h-screen w-full p-6 md:p-8">
                {/* Top Bar */}
                <div className="w-full flex justify-between items-center mb-8">
                    <Link
                        href="/"
                        className="glass-light px-4 py-2 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </Link>

                    <div className="flex gap-3">
                        <StreakCounter />
                        <AuthButton />
                    </div>
                </div>

                {/* Stats Container */}
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
                        Your Focus Stats
                    </h1>

                    {/* Heatmap */}
                    <FocusHeatmap className="mb-8" />

                    {/* Additional stats can go here */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-light p-6 rounded-lg">
                            <div className="text-gray-400 text-sm mb-2">This Week</div>
                            <div className="text-3xl font-bold text-white">Coming Soon</div>
                        </div>
                        <div className="glass-light p-6 rounded-lg">
                            <div className="text-gray-400 text-sm mb-2">This Month</div>
                            <div className="text-3xl font-bold text-white">Coming Soon</div>
                        </div>
                        <div className="glass-light p-6 rounded-lg">
                            <div className="text-gray-400 text-sm mb-2">All Time</div>
                            <div className="text-3xl font-bold text-white">Coming Soon</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
