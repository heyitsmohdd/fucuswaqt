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

interface HeroTransition {
    src: string;
    type: 'video' | 'image';
    rect: { top: number; left: number; width: number; height: number; clipStart: string };
    isExpanding: boolean;
    isFading: boolean;
}

type TabType = 'motion' | 'stills';

export function BackgroundPickerModal({ isOpen, onClose }: BackgroundPickerModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('motion');
    const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
    const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [heroTransition, setHeroTransition] = useState<HeroTransition | null>(null);
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

    if (!mounted && !heroTransition) return null;

    const handleVideoLoad = (videoId: string) => {
        setLoadedVideos(prev => new Set(prev).add(videoId));
    };

    const startHero = (
        id: string,
        type: 'video' | 'image',
        src: string,
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        const domRect = e.currentTarget.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const rect = { top: domRect.top, left: domRect.left, width: domRect.width, height: domRect.height };
        const clipStart = `inset(${rect.top}px ${vw - rect.left - rect.width}px ${vh - rect.top - rect.height}px ${rect.left}px round 12px)`;

        // Dismiss modal immediately so hero feels like it emerges from the thumbnail
        setVisible(false);

        setHeroTransition({ src, type, rect: { ...rect, clipStart }, isExpanding: false, isFading: false });

        requestAnimationFrame(() => requestAnimationFrame(() => {
            setHeroTransition(prev => prev ? { ...prev, isExpanding: true } : null);
        }));

        // Swap background at 60% of expansion — ready when hero fades
        setTimeout(() => setCurrentBackground(id, type), 260);
        // Unmount modal
        setTimeout(() => onClose(), 420);
        // Begin hero fade-out
        setTimeout(() => {
            setHeroTransition(prev => prev ? { ...prev, isFading: true } : null);
        }, 440);
        // Remove hero element
        setTimeout(() => setHeroTransition(null), 760);
    };

    const heroStyle: React.CSSProperties = heroTransition ? {
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        pointerEvents: 'none',
        willChange: 'clip-path',
        clipPath: heroTransition.isExpanding
            ? 'inset(0px 0px 0px 0px round 0px)'
            : heroTransition.rect.clipStart,
        opacity: heroTransition.isFading ? 0 : 1,
        transition: 'clip-path 0.44s cubic-bezier(0.16,1,0.3,1), opacity 0.32s ease',
    } : {};

    return (
        <>
            {mounted && (
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
                            'relative w-full max-w-3xl transition-all duration-220',
                            visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
                        )}
                        style={{
                            background: '#0A0A0A',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: 'none',
                            borderRadius: 20,
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="background-picker-title"
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '20px 24px 16px',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                        }}>
                            <h2 id="background-picker-title" style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
                                Set your scene
                            </h2>
                            <button
                                onClick={onClose}
                                style={{
                                    width: 32, height: 32,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                                    background: '#0A0A0A', cursor: 'pointer',
                                    color: '#FFFFFF', padding: 0,
                                }}
                                aria-label="Close background picker"
                            >
                                <X style={{ width: 16, height: 16 }} aria-hidden="true" />
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div style={{ padding: '16px 24px 0' }}>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                {(['motion', 'stills'] as const).map((tab) => {
                                    const isActive = activeTab === tab;
                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            style={{
                                                padding: '7px 20px',
                                                background: isActive ? 'rgba(255,255,255,0.9)' : 'transparent',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                                boxShadow: 'none',
                                                borderRadius: 8,
                                                cursor: 'pointer',
                                                fontSize: '0.875rem', fontWeight: 700,
                                                color: isActive ? '#0A0A0A' : 'rgba(255,255,255,0.5)',
                                                textTransform: 'capitalize',
                                                transition: 'background 0.12s, color 0.12s',
                                            }}
                                        >
                                            {tab}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-4 sm:px-6 py-4 sm:py-5 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto">
                            {/* Motion Tab */}
                            <div
                                className="transition-opacity duration-200"
                                style={{ opacity: activeTab === 'motion' ? 1 : 0, display: activeTab === 'motion' ? 'block' : 'none' }}
                            >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {VIDEO_BACKGROUNDS.map((video) => {
                                        const isLoaded = loadedVideos.has(video.id);
                                        const isSelected = currentBackgroundType === 'video' && currentBackgroundId === video.id;
                                        const isHovered = hoveredVideoId === video.id;

                                        return (
                                            <button
                                                key={video.id}
                                                onClick={(e) => startHero(video.id, 'video', video.url, e)}
                                                onMouseEnter={() => setHoveredVideoId(video.id)}
                                                onMouseLeave={() => setHoveredVideoId(null)}
                                                className={cn(
                                                    'group relative aspect-video rounded-xl overflow-hidden border transition-all duration-200 hover:scale-[1.03]',
                                                    isSelected
                                                        ? 'border-white/60 ring-2 ring-white/30'
                                                        : 'border-white/10 hover:border-white/30'
                                                )}
                                                aria-label={`Select ${video.name} background`}
                                            >
                                                <div className={cn(
                                                    'absolute inset-0 bg-white/5 transition-opacity duration-300',
                                                    isHovered && isLoaded ? 'opacity-0' : isHovered ? 'animate-pulse' : 'opacity-100'
                                                )} />

                                                {isHovered && (
                                                    <video
                                                        key={video.id}
                                                        src={video.url}
                                                        className={cn(
                                                            'w-full h-full object-cover transition-opacity duration-300',
                                                            isLoaded ? 'opacity-100' : 'opacity-0'
                                                        )}
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                        preload="auto"
                                                        aria-hidden="true"
                                                        onLoadedMetadata={() => handleVideoLoad(video.id)}
                                                    />
                                                )}

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

                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                                                    <p className="text-white text-xs font-medium">{video.name}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Stills Tab */}
                            <div
                                className="transition-opacity duration-200"
                                style={{ opacity: activeTab === 'stills' ? 1 : 0, display: activeTab === 'stills' ? 'block' : 'none' }}
                            >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {IMAGE_BACKGROUNDS.map((image) => {
                                        const isSelected = currentBackgroundType === 'image' && currentBackgroundId === image.id;

                                        return (
                                            <button
                                                key={image.id}
                                                onClick={(e) => startHero(image.id, 'image', image.url, e)}
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
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                                                    <p className="text-white text-xs font-medium">{image.name}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero expansion overlay */}
            {heroTransition && (
                <div style={heroStyle}>
                    {heroTransition.type === 'video' ? (
                        <video
                            src={heroTransition.src}
                            autoPlay
                            muted
                            playsInline
                            loop
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={heroTransition.src}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            )}
        </>
    );
}
