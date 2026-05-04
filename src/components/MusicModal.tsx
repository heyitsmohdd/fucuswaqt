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

    const videoId = extractYouTubeId(videoUrl);

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
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 pb-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        YouTube
                        {musicHint.visible && (
                            <kbd className="px-2 py-0.5 bg-white/15 border border-white/20 rounded-lg text-white/70 text-[11px] font-mono whitespace-nowrap animate-fade-in">
                                M
                            </kbd>
                        )}
                    </h2>

                    {/* Change Button or Input Field */}
                    <div className="flex items-center gap-2">
                        {isChangingUrl ? (
                            <>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    placeholder="URL from YT..."
                                    className="px-3 py-1.5 bg-black/60 text-white text-xs rounded-lg border border-white/20 outline-none focus:border-white/40 w-32"
                                    autoFocus
                                />
                                <button
                                    onClick={handleConfirmChange}
                                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Confirm"
                                >
                                    <Check className="w-4 h-4 text-white" />
                                </button>
                                <button
                                    onClick={handleCancelChange}
                                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Cancel"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleChangeClick}
                                    className="flex items-center gap-1.5 px-2 py-1 text-white/60 hover:text-white transition-colors"
                                >
                                    <Music className="w-3 h-3" />
                                    <span className="text-xs">Change</span>
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Video Player */}
                <div className="px-4 pb-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/50">
                        <div ref={ytContainerRef} className="absolute inset-0 w-full h-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
