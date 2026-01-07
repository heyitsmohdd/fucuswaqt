'use client';

import { useEffect, useRef } from 'react';
import { useAudioStore } from '@/stores/audioStore';
import { AUDIO_TRACKS } from '@/constants';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SoundMixerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Emoji map for each sound
const emojiMap: Record<string, string> = {
    CloudRain: '🌧️',
    Flame: '🔥',
    Coffee: '☕',
    Waves: '🌊',
    Bird: '🐦',
};

export function SoundMixerModal({ isOpen, onClose }: SoundMixerModalProps) {
    const { activeTracks, volumes, toggleTrack, setVolume, getVolume } = useAudioStore();
    const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

    // Initialize audio elements
    useEffect(() => {
        AUDIO_TRACKS.forEach((track) => {
            if (!audioRefs.current.has(track.id)) {
                const audio = new Audio(track.url);
                audio.loop = true;
                audio.volume = getVolume(track.id);
                audioRefs.current.set(track.id, audio);
            }
        });

        return () => {
            audioRefs.current.forEach((audio) => {
                audio.pause();
                audio.src = '';
            });
            audioRefs.current.clear();
        };
    }, [getVolume]);

    // Handle track play/pause
    useEffect(() => {
        audioRefs.current.forEach((audio, trackId) => {
            if (activeTracks.has(trackId)) {
                audio.play().catch(() => {
                    // Autoplay restriction handled silently
                });
            } else {
                audio.pause();
            }
        });
    }, [activeTracks]);

    // Update volume
    useEffect(() => {
        audioRefs.current.forEach((audio, trackId) => {
            audio.volume = getVolume(trackId);
        });
    }, [volumes, getVolume]);

    const handleVolumeChange = (trackId: string, value: number) => {
        setVolume(trackId, value);
    };

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                    <h2 className="text-2xl font-bold text-white">White Noises</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6 text-white/80" />
                    </button>
                </div>

                {/* Sounds Grid */}
                <div className="px-6 pb-6">
                    <div className="grid grid-cols-5 gap-4">
                        {AUDIO_TRACKS.map((track) => {
                            const emoji = emojiMap[track.icon as keyof typeof emojiMap] || '🎵';
                            const isActive = activeTracks.has(track.id);

                            return (
                                <div key={track.id} className="relative flex flex-col items-center gap-2">
                                    {/* Active Indicator Dot */}
                                    {isActive && (
                                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
                                    )}

                                    {/* Sound Button */}
                                    <button
                                        onClick={() => toggleTrack(track.id)}
                                        className={cn(
                                            'w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all',
                                            isActive
                                                ? 'bg-white/20 border-2 border-white/30 shadow-lg'
                                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                        )}
                                        aria-label={track.name}
                                        title={track.name}
                                    >
                                        {emoji}
                                    </button>

                                    {/* Volume Slider (appears on active) */}
                                    {isActive && (
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={getVolume(track.id) * 100}
                                            onChange={(e) => handleVolumeChange(track.id, parseInt(e.target.value) / 100)}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(to right, rgba(255,255,255,0.4) ${getVolume(track.id) * 100}%, rgba(255,255,255,0.1) ${getVolume(track.id) * 100}%)`
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
