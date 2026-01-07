'use client';

import { useEffect, useRef, useState } from 'react';
import { useAudioStore } from '@/stores/audioStore';
import { AUDIO_TRACKS } from '@/constants';
import { CloudRain, Flame, Coffee, Waves, Bird, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
    CloudRain,
    Flame,
    Coffee,
    Waves,
    Bird,
};

export function SoundMixer() {
    const { activeTracks, volumes, toggleTrack, setVolume, getVolume } = useAudioStore();
    const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
    const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

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

    return (
        <div className="glass rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
                <Volume2 className="w-5 h-5 text-white" />
                <h3 className="text-white font-semibold text-lg">White Noises</h3>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {AUDIO_TRACKS.map((track) => {
                    const Icon = iconMap[track.icon as keyof typeof iconMap];
                    const isActive = activeTracks.has(track.id);
                    const showSlider = hoveredTrack === track.id || isActive;

                    return (
                        <div
                            key={track.id}
                            className="flex flex-col items-center gap-2"
                            onMouseEnter={() => setHoveredTrack(track.id)}
                            onMouseLeave={() => setHoveredTrack(null)}
                        >
                            <button
                                onClick={() => toggleTrack(track.id)}
                                className={cn(
                                    'w-16 h-16 rounded-full flex items-center justify-center transition-all',
                                    isActive
                                        ? 'bg-white/30 border-2 border-white/50'
                                        : 'glass-light hover:bg-white/20'
                                )}
                            >
                                <Icon className="w-7 h-7 text-white" />
                            </button>

                            <span className="text-xs text-gray-200 text-center">{track.name}</span>

                            {/* Volume Slider */}
                            {showSlider && (
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={getVolume(track.id) * 100}
                                    onChange={(e) => handleVolumeChange(track.id, parseInt(e.target.value) / 100)}
                                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                                    style={{
                                        background: `linear-gradient(to right, rgba(255,255,255,0.6) ${getVolume(track.id) * 100}%, rgba(255,255,255,0.2) ${getVolume(track.id) * 100}%)`
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
