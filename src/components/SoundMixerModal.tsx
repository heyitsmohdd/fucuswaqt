'use client';

import { useEffect, useRef, useState } from 'react';
import { useAudioStore } from '@/stores/audioStore';
import { AUDIO_TRACKS } from '@/constants';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SoundMixerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

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
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

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

    // Initialize audio elements
    useEffect(() => {
        const currentAudioRefs = audioRefs.current;
        AUDIO_TRACKS.forEach((track) => {
            if (!currentAudioRefs.has(track.id)) {
                const audio = new Audio(track.url);
                audio.loop = true;
                audio.volume = getVolume(track.id);
                currentAudioRefs.set(track.id, audio);
            }
        });
        return () => {
            currentAudioRefs.forEach((audio) => {
                audio.pause();
                audio.src = '';
            });
            currentAudioRefs.clear();
        };
    }, [getVolume]);

    // Handle track play/pause
    useEffect(() => {
        audioRefs.current.forEach((audio, trackId) => {
            if (activeTracks.has(trackId)) {
                audio.play().catch(() => {
                    toast.error('Could not play sound due to browser restrictions');
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

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!mounted) return null;

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
                    'relative w-full max-w-sm bg-black/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl transition-all duration-220',
                    visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sound-mixer-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                    <div>
                        <h2 id="sound-mixer-title" className="text-lg font-semibold text-white tracking-tight">
                            Ambient Sounds
                        </h2>
                        {activeTracks.size > 0 && (
                            <p className="text-xs text-white/40 mt-0.5">
                                {activeTracks.size} playing
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors btn-press"
                        aria-label="Close sound mixer"
                    >
                        <X className="w-4 h-4 text-white/60" aria-hidden="true" />
                    </button>
                </div>

                {/* Sounds Grid */}
                <div className="px-6 pb-6">
                    <div className="grid grid-cols-5 gap-3">
                        {AUDIO_TRACKS.map((track) => {
                            const emoji = emojiMap[track.icon as keyof typeof emojiMap] || '🎵';
                            const isActive = activeTracks.has(track.id);

                            return (
                                <div key={track.id} className="flex flex-col items-center gap-2.5">
                                    {/* Sound Button */}
                                    <button
                                        onClick={() => toggleTrack(track.id)}
                                        className={cn(
                                            'relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 btn-press',
                                            isActive
                                                ? 'bg-white/20 border-2 border-white/35 shadow-lg shadow-white/10 scale-105'
                                                : 'bg-white/5 border border-white/10 hover:bg-white/12 hover:scale-105'
                                        )}
                                        aria-label={`${isActive ? 'Stop' : 'Play'} ${track.name}`}
                                        title={track.name}
                                    >
                                        {emoji}
                                        {/* Active indicator pulse */}
                                        {isActive && (
                                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-white rounded-full ring-2 ring-black/80 pulse-glow" />
                                        )}
                                    </button>

                                    {/* Volume Slider */}
                                    {isActive && (
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={getVolume(track.id) * 100}
                                            onChange={(e) => setVolume(track.id, parseInt(e.target.value) / 100)}
                                            className="w-full h-0.5 rounded-full appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(to right, rgba(255,255,255,0.6) ${getVolume(track.id) * 100}%, rgba(255,255,255,0.12) ${getVolume(track.id) * 100}%)`
                                            }}
                                            aria-label={`${track.name} volume`}
                                            aria-valuenow={Math.round(getVolume(track.id) * 100)}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
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
