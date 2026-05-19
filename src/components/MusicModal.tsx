'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Music, Check } from 'lucide-react';
import { useShortcutHint } from '@/hooks/useShortcutHint';
import { cn } from '@/lib/utils';
import { DEFAULT_YOUTUBE_URL } from '@/constants';
import { toast } from 'sonner';

interface YTPlayerInstance {
    playVideo(): void;
    pauseVideo(): void;
    cueVideoById(videoId: string): void;
    destroy(): void;
}

interface YTStateChangeEvent {
    data: number;
}

declare global {
    interface Window {
        YT: {
            Player: new (
                element: HTMLElement,
                config: {
                    videoId: string;
                    playerVars?: Record<string, number>;
                    events?: {
                        onReady?: () => void;
                        onStateChange?: (e: YTStateChangeEvent) => void;
                    };
                }
            ) => YTPlayerInstance;
        };
        onYouTubeIframeAPIReady: () => void;
    }
}

interface MusicModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Validate if a URL is a valid YouTube URL
const isValidYouTubeUrl = (url: string): boolean => {
    // eslint-disable-next-line security/detect-unsafe-regex
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]{11}([\?&][\w\-\=\%]*)?$/;
    return pattern.test(url.trim());
};

// Helper function to extract YouTube video ID from URL
const extractYouTubeId = (url: string): string | null => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
};

export function MusicModal({ isOpen, onClose }: MusicModalProps) {
    const [isChangingUrl, setIsChangingUrl] = useState(false);
    const [videoUrl, setVideoUrl] = useState(DEFAULT_YOUTUBE_URL);
    const [inputValue, setInputValue] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const widgetRef = useRef<HTMLDivElement>(null);
    const ytContainerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YTPlayerInstance | null>(null);
    const musicHint = useShortcutHint('hint-m', 'Press M to play/pause music');

    const createPlayer = useCallback((videoId: string) => {
        if (!ytContainerRef.current) return;
        if (playerRef.current) playerRef.current.destroy();
        playerRef.current = new window.YT.Player(ytContainerRef.current, {
            videoId,
            playerVars: { autoplay: 0, mute: 0 },
            events: {
                onStateChange: (e: YTStateChangeEvent) => setIsPlaying(e.data === 1),
            },
        });
    }, []);

    useEffect(() => {
        const videoId = extractYouTubeId(videoUrl);
        if (!videoId) return;
        if (playerRef.current) {
            playerRef.current.cueVideoById(videoId);
            return;
        }
        const initPlayer = () => createPlayer(videoId);
        if (window.YT?.Player) {
            initPlayer();
        } else {
            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                const script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                document.body.appendChild(script);
            }
            window.onYouTubeIframeAPIReady = initPlayer;
        }
        return () => { playerRef.current?.destroy(); playerRef.current = null; };
    }, [videoUrl, createPlayer]);

    const togglePlayback = useCallback(() => {
        if (!playerRef.current) return;
        isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
        musicHint.trigger();
    }, [isPlaying, musicHint]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === 'm' || e.key === 'M') togglePlayback();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [togglePlayback]);

    const handleCancelChange = () => {
        setInputValue('');
        setIsChangingUrl(false);
    };

    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                if (isChangingUrl) {
                    handleCancelChange();
                } else {
                    onClose();
                }
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, isChangingUrl, onClose]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isOpen && widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleChangeClick = () => {
        setInputValue(videoUrl);
        setIsChangingUrl(true);
    };

    const handleConfirmChange = () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) {
            toast.error('Please enter a YouTube URL');
            return;
        }

        if (!isValidYouTubeUrl(trimmedInput)) {
            toast.error('Please enter a valid YouTube URL (e.g., youtube.com/watch?v=... or youtu.be/...)');
            return;
        }

        setVideoUrl(trimmedInput);
        setIsChangingUrl(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleConfirmChange();
        } else if (e.key === 'Escape') {
            handleCancelChange();
        }
    };

    return (
        <div
            ref={widgetRef}
            className={cn(
                'fixed bottom-24 left-6 z-50 w-80 transition-all duration-300 ease-in-out',
                isOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
            )}
        >
            {/* Modal */}
            <div style={{
                background: '#E8F5EC',
                border: '2px solid #0D2118',
                boxShadow: '4px 4px 0px #0D2118',
                borderRadius: 16,
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px 12px',
                    borderBottom: '2px solid #0D2118',
                }}>
                    <h2 style={{ color: '#0D2118', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
                        YouTube
                        {musicHint.visible && (
                            <kbd style={{
                                padding: '1px 7px',
                                background: 'rgba(133,171,139,0.15)',
                                border: '1.5px solid #0D2118',
                                borderRadius: 5,
                                color: '#0D2118',
                                fontSize: '0.7rem',
                                fontFamily: 'monospace',
                                fontWeight: 700,
                            }} className="animate-fade-in">
                                M
                            </kbd>
                        )}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {isChangingUrl ? (
                            <>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    placeholder="URL from YT..."
                                    style={{
                                        padding: '5px 10px',
                                        background: '#E8F5EC',
                                        border: '2px solid #0D2118',
                                        borderRadius: 0,
                                        color: '#0D2118',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        outline: 'none',
                                        width: 128,
                                    }}
                                    autoFocus
                                />
                                <button
                                    onClick={handleConfirmChange}
                                    style={{
                                        width: 28, height: 28,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '2px solid #0D2118',
                                        background: '#85AB8B',
                                        cursor: 'pointer', padding: 0, borderRadius: 6,
                                    }}
                                    aria-label="Confirm"
                                >
                                    <Check style={{ width: 13, height: 13, color: '#FFFFFF' }} />
                                </button>
                                <button
                                    onClick={handleCancelChange}
                                    style={{
                                        width: 28, height: 28,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '2px solid #0D2118',
                                        background: '#E8F5EC',
                                        cursor: 'pointer', padding: 0, borderRadius: 6,
                                    }}
                                    aria-label="Cancel"
                                >
                                    <X style={{ width: 13, height: 13, color: '#0D2118' }} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleChangeClick}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 5,
                                        padding: '4px 10px',
                                        border: '1.5px solid rgba(13,33,24,0.35)',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        color: '#0D2118', opacity: 0.6,
                                        fontSize: '0.75rem', fontWeight: 700,
                                        borderRadius: 6,
                                    }}
                                >
                                    <Music style={{ width: 11, height: 11 }} />
                                    Change
                                </button>
                                <button
                                    onClick={onClose}
                                    style={{
                                        width: 28, height: 28,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '2px solid #0D2118',
                                        background: '#E8F5EC',
                                        cursor: 'pointer', padding: 0, borderRadius: 6,
                                        color: '#0D2118',
                                    }}
                                    aria-label="Close"
                                >
                                    <X style={{ width: 13, height: 13 }} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Video Player */}
                <div style={{ padding: '14px 16px 16px' }}>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#000', border: '2px solid #0D2118' }}>
                        <div ref={ytContainerRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
