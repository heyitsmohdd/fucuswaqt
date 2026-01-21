'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Play, Loader2 } from 'lucide-react';
import { VIDEO_BACKGROUNDS, IMAGE_BACKGROUNDS } from '@/constants';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';

interface BackgroundPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'motion' | 'stills';

export function BackgroundPickerModal({ isOpen, onClose }: BackgroundPickerModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('motion');
    const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
    const [isSelecting, setIsSelecting] = useState(false);
    const { setCurrentBackground } = useAppStore();

    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleVideoLoad = (videoId: string) => {
        setLoadedVideos(prev => new Set(prev).add(videoId));
    };

    const handleVideoSelect = async (videoId: string) => {
        setIsSelecting(true);
        setCurrentBackground(videoId, 'video');
        // Small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsSelecting(false);
        onClose();
    };

    const handleImageSelect = async (imageId: string) => {
        setIsSelecting(true);
        setCurrentBackground(imageId, 'image');
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsSelecting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-4xl bg-black/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="background-picker-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                    <h2 id="background-picker-title" className="text-2xl font-bold text-white">Set your focus scene</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                        aria-label="Close background picker"
                    >
                        <X className="w-6 h-6 text-white/80" aria-hidden="true" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="px-6">
                    <div className="flex gap-8 border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('motion')}
                            className={cn(
                                'pb-3 px-2 text-sm font-medium transition-all relative',
                                activeTab === 'motion'
                                    ? 'text-white'
                                    : 'text-white/50 hover:text-white/70'
                            )}
                        >
                            Motion
                            {activeTab === 'motion' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('stills')}
                            className={cn(
                                'pb-3 px-2 text-sm font-medium transition-all relative',
                                activeTab === 'stills'
                                    ? 'text-white'
                                    : 'text-white/50 hover:text-white/70'
                            )}
                        >
                            Stills
                            {activeTab === 'stills' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-6">
                    {/* Global Loading Overlay */}
                    {isSelecting && (
                        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-3xl">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                <span className="text-white text-sm">Loading background...</span>
                            </div>
                        </div>
                    )}

                    {/* Motion Tab Content */}
                    {activeTab === 'motion' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {VIDEO_BACKGROUNDS.map((video) => {
                                const isLoaded = loadedVideos.has(video.id);
                                return (
                                    <button
                                        key={video.id}
                                        onClick={() => handleVideoSelect(video.id)}
                                        className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02]"
                                        aria-label={`Select ${video.name} background`}
                                        disabled={isSelecting}
                                    >
                                        {/* Loading Skeleton */}
                                        {!isLoaded && (
                                            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                                            </div>
                                        )}

                                        {/* Video Preview - Using first frame as thumbnail */}
                                        <video
                                            src={video.url}
                                            className={cn(
                                                "w-full h-full object-cover transition-opacity",
                                                isLoaded ? "opacity-100" : "opacity-0"
                                            )}
                                            muted
                                            playsInline
                                            aria-hidden="true"
                                            onLoadedData={() => handleVideoLoad(video.id)}
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center" aria-hidden="true">
                                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                                <Play className="w-6 h-6 text-white ml-1" />
                                            </div>
                                        </div>


                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Stills Tab Content */}
                    {activeTab === 'stills' && (
                        <div className="grid grid-cols-2 gap-4">
                            {IMAGE_BACKGROUNDS.map((image) => (
                                <button
                                    key={image.id}
                                    onClick={() => handleImageSelect(image.id)}
                                    className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02]"
                                    aria-label={`Select ${image.name} background`}
                                >
                                    {/* Image */}
                                    <Image
                                        src={image.url}
                                        alt={image.name}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" aria-hidden="true" />


                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
