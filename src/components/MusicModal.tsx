'use client';

import { useState, useEffect } from 'react';
import { X, Music, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Helper function to extract YouTube video ID from URL
const extractYouTubeId = (url: string): string => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?]+)/,
        /youtube\.com\/embed\/([^&\?]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    // If no match, assume the input is already a video ID
    return url;
};

export function MusicModal({ isOpen, onClose }: MusicModalProps) {
    const [isChangingUrl, setIsChangingUrl] = useState(false);
    const [videoUrl, setVideoUrl] = useState('https://youtu.be/uyTtCdaEux8?si=E9KEDBOkM2qjtfKu'); // Lofi hip hop radio
    const [inputValue, setInputValue] = useState('');

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

    const videoId = extractYouTubeId(videoUrl);

    const handleChangeClick = () => {
        setInputValue(videoUrl);
        setIsChangingUrl(true);
    };

    const handleConfirmChange = () => {
        if (inputValue.trim()) {
            setVideoUrl(inputValue.trim());
        }
        setIsChangingUrl(false);
    };

    const handleCancelChange = () => {
        setInputValue('');
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
                    <h2 className="text-lg font-bold text-white">YouTube</h2>

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
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
