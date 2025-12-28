'use client';

import { useState, useEffect } from 'react';
import { X, Music, Check } from 'lucide-react';

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
    const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=jfKfPfyJRdk'); // Lofi hip hop radio
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

    if (!isOpen) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                    <h2 className="text-xl font-bold text-white">YouTube</h2>

                    {/* Change Button or Input Field */}
                    <div className="flex items-center gap-2">
                        {isChangingUrl ? (
                            <>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    placeholder="URL from YT, Spotify, Ap..."
                                    className="px-4 py-2 bg-black/60 text-white text-sm rounded-lg border border-white/20 outline-none focus:border-white/40 w-64"
                                    autoFocus
                                />
                                <button
                                    onClick={handleConfirmChange}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Confirm"
                                >
                                    <Check className="w-5 h-5 text-white" />
                                </button>
                                <button
                                    onClick={handleCancelChange}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Cancel"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleChangeClick}
                                className="flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white transition-colors"
                            >
                                <Music className="w-4 h-4" />
                                <span className="text-sm">Change</span>
                            </button>
                        )}

                        {!isChangingUrl && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors ml-2"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Video Player */}
                <div className="px-6 pb-6">
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
