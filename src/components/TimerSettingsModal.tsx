'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { useTimerStore } from '@/stores/timerStore';
import { TIMER_PRESETS, type TimerPresetKey } from '@/constants';
import { cn } from '@/lib/utils';

interface TimerSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TimerSettingsModal({ isOpen, onClose }: TimerSettingsModalProps) {
    const {
        currentPreset,
        customDurations,
        setPreset,
        setCustomDurations,
    } = useTimerStore();

    const [localCustom, setLocalCustom] = useState({
        focus: customDurations.focus,
        break: customDurations.break,
        longBreak: customDurations.longBreak,
    });

    const modalRef = useRef<HTMLDivElement>(null);

    // Sync local state when modal opens
    useEffect(() => {
        if (isOpen) {
            setLocalCustom({
                focus: customDurations.focus,
                break: customDurations.break,
                longBreak: customDurations.longBreak,
            });
        }
    }, [isOpen, customDurations]);

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handlePresetSelect = (preset: TimerPresetKey) => {
        if (preset === 'custom') {
            setCustomDurations(localCustom);
        }
        setPreset(preset);
    };

    const handleCustomSave = () => {
        setCustomDurations(localCustom);
        setPreset('custom');
    };

    const presetButtons: { key: Exclude<TimerPresetKey, 'custom'>; label: string }[] = [
        { key: 'short', label: '25 / 5 / 15' },
        { key: 'medium', label: '50 / 10 / 20' },
        { key: 'long', label: '90 / 15 / 30' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-w-md bg-black/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Timer Settings</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-white/80" />
                    </button>
                </div>

                {/* Presets */}
                <div className="mb-6">
                    <label className="text-sm text-white/60 mb-3 block">Presets (Focus / Break / Long)</label>
                    <div className="grid grid-cols-3 gap-2">
                        {presetButtons.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => handlePresetSelect(key)}
                                className={cn(
                                    "p-3 rounded-xl text-sm font-medium transition-all border",
                                    currentPreset === key
                                        ? "bg-white/20 border-white/40 text-white"
                                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 my-4" />

                {/* Custom */}
                <div>
                    <label className="text-sm text-white/60 mb-3 block">Custom (minutes)</label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div>
                            <label className="text-xs text-white/40 mb-1 block">Focus</label>
                            <input
                                type="number"
                                min={1}
                                max={180}
                                value={localCustom.focus}
                                onChange={(e) => setLocalCustom({ ...localCustom, focus: Math.max(1, Math.min(180, Number(e.target.value))) })}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-white/30"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-white/40 mb-1 block">Break</label>
                            <input
                                type="number"
                                min={1}
                                max={60}
                                value={localCustom.break}
                                onChange={(e) => setLocalCustom({ ...localCustom, break: Math.max(1, Math.min(60, Number(e.target.value))) })}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-white/30"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-white/40 mb-1 block">Long</label>
                            <input
                                type="number"
                                min={1}
                                max={90}
                                value={localCustom.longBreak}
                                onChange={(e) => setLocalCustom({ ...localCustom, longBreak: Math.max(1, Math.min(90, Number(e.target.value))) })}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-white/30"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleCustomSave}
                        className={cn(
                            "w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                            currentPreset === 'custom'
                                ? "bg-green-600/80 text-white"
                                : "bg-white/10 text-white/80 hover:bg-white/20"
                        )}
                    >
                        <Check className="w-4 h-4" />
                        {currentPreset === 'custom' ? 'Custom Active' : 'Use Custom'}
                    </button>
                </div>
            </div>
        </div>
    );
}
