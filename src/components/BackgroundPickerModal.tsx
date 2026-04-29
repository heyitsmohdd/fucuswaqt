'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Play, Check } from 'lucide-react';
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
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const { setCurrentBackground, currentBackgroundId, currentBackgroundType } = useAppStore();

    // Animate in / out
    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        } else {
            setVisible(false);
            const t = setTimeout(() => setMounted(false), 220);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!mounted) return null;

    const handleVideoLoad = (videoId: string) => {
        setLoadedVideos(prev => new Set(prev).add(videoId));
    };

    const handleVideoSelect = (videoId: string) => {
        setCurrentBackground(videoId, 'video');
        onClose();
    };

    const handleImageSelect = (imageId: string) => {
        setCurrentBackground(imageId, 'image');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={cn(
                    'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200',
                    visible ? 'opacity-100' : 'opacity-0'
                )}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    'relative w-full max-w-3xl bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl transition-all duration-220',
                    visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="background-picker-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                    <h2 id="background-picker-title" className="text-lg font-semibold text-white tracking-tight">
                        Set your scene
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors btn-press"
                        aria-label="Close background picker"
                    >
                        <X className="w-4 h-4 text-white/60" aria-hidden="true" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="px-6">
                    <div className="flex gap-1 border-b border-white/8">
                        {(['motion', 'stills'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    'relative pb-3 px-3 text-sm font-medium transition-all duration-200 capitalize',
                                    activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/70'
                                )}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 right-0 h-px bg-white rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
                    {/* Motion Tab */}
                    {activeTab === 'motion' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {VIDEO_BACKGROUNDS.map((video) => {
                                const isLoaded = loadedVideos.has(video.id);
                                const isSelected = currentBackgroundType === 'video' && currentBackgroundId === video.id;

                                return (
                                    <button
                                        key={video.id}
                                        onClick={() => handleVideoSelect(video.id)}
                                        className={cn(
                                            'group relative aspect-video rounded-xl overflow-hidden border transition-all duration-200 hover:scale-[1.03]',
                                            isSelected
                                                ? 'border-white/60 ring-2 ring-white/30'
                                                : 'border-white/10 hover:border-white/30'
                                        )}
                                        aria-label={`Select ${video.name} background`}
                                    >
                                        {/* Loading Skeleton */}
                                        {!isLoaded && (
                                            <div className="absolute inset-0 bg-white/5 animate-pulse" />
                                        )}

                                        {/* Video preview */}
                                        <video
                                            src={video.url}
                                            className={cn(
                                                'w-full h-full object-cover transition-opacity duration-300',
                                                isLoaded ? 'opacity-100' : 'opacity-0'
                                            )}
                                            muted
                                            playsInline
                                            aria-hidden="true"
                                            onLoadedData={() => handleVideoLoad(video.id)}
                                        />

                                        {/* Hover overlay with play icon */}
                                        <div className={cn(
                                            'absolute inset-0 flex items-center justify-center transition-all duration-200',
                                            isSelected ? 'bg-black/20' : 'bg-black/30 group-hover:bg-black/10'
                                        )}>
                                            {isSelected ? (
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-black" />
                                                </div>
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 transition-colors">
                                                    <Play className="w-4 h-4 text-white ml-0.5" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Name label on hover */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                                            <p className="text-white text-xs font-medium">{video.name}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Stills Tab */}
                    {activeTab === 'stills' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {IMAGE_BACKGROUNDS.map((image) => {
                                const isSelected = currentBackgroundType === 'image' && currentBackgroundId === image.id;

                                return (
                                    <button
                                        key={image.id}
                                        onClick={() => handleImageSelect(image.id)}
                                        className={cn(
                                            'group relative aspect-video rounded-xl overflow-hidden border transition-all duration-200 hover:scale-[1.03]',
                                            isSelected
                                                ? 'border-white/60 ring-2 ring-white/30'
                                                : 'border-white/10 hover:border-white/30'
                                        )}
                                        aria-label={`Select ${image.name} background`}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className={cn(
                                            'absolute inset-0 flex items-center justify-center transition-all duration-200',
                                            isSelected ? 'bg-black/20' : 'bg-black/0 group-hover:bg-black/10'
                                        )}>
                                            {isSelected && (
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-black" />
                                                </div>
                                            )}
                                        </div>
                                        {/* Name label */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                                            <p className="text-white text-xs font-medium">{image.name}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
