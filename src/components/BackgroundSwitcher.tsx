'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { VIDEO_BACKGROUNDS } from '@/constants';
import { MonitorPlay, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BackgroundSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const { currentVideoId, setCurrentVideo } = useAppStore();

    const handleVideoChange = (videoId: string) => {
        setCurrentVideo(videoId);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="glass-light rounded-full p-3 hover:bg-white/20 transition-all"
                title="Change background"
                aria-label="Change background scene"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <MonitorPlay className="w-6 h-6 text-white" aria-hidden="true" />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute bottom-full mb-2 left-0 glass rounded-xl p-3 min-w-[200px] z-50">
                        <div className="text-xs text-gray-400 mb-2 px-2">Background Scenes</div>
                        {VIDEO_BACKGROUNDS.map((video) => (
                            <button
                                key={video.id}
                                onClick={() => handleVideoChange(video.id)}
                                className={cn(
                                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between',
                                    currentVideoId === video.id
                                        ? 'bg-white/20 text-white'
                                        : 'text-gray-300 hover:bg-white/10'
                                )}
                            >
                                <span>{video.name}</span>
                                {currentVideoId === video.id && (
                                    <Check className="w-4 h-4" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
