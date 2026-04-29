'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useTimerStore } from '@/stores/timerStore';
import { TIMER_PRESETS, type TimerPresetKey } from '@/constants';
import { cn } from '@/lib/utils';

interface TimerSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TimerSettingsModal({ isOpen, onClose }: TimerSettingsModalProps) {
    const { currentPreset, customDurations, setPreset, setCustomDurations } = useTimerStore();

    const [localCustom, setLocalCustom] = useState({
        focus: String(customDurations.focus),
        break: String(customDurations.break),
        longBreak: String(customDurations.longBreak),
    });

    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    // Animate in / out
    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            setLocalCustom({
                focus: String(customDurations.focus),
                break: String(customDurations.break),
                longBreak: String(customDurations.longBreak),
            });
            requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        } else {
            setVisible(false);
            const t = setTimeout(() => setMounted(false), 220);
            return () => clearTimeout(t);
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

    if (!mounted) return null;

    const handlePresetSelect = (preset: TimerPresetKey) => {
        setPreset(preset);
        onClose();
    };

    const handleCustomSave = () => {
        const parsed = {
            focus: Math.max(1, Math.min(180, Number(localCustom.focus) || 25)),
            break: Math.max(1, Math.min(60, Number(localCustom.break) || 5)),
            longBreak: Math.max(1, Math.min(90, Number(localCustom.longBreak) || 15)),
        };
        setCustomDurations(parsed);
        setPreset('custom');
        onClose();
    };

    const presetButtons: { key: Exclude<TimerPresetKey, 'custom'>; focus: number; breakMin: number; long: number }[] = [
        { key: 'short',  focus: 25, breakMin: 5,  long: 15 },
        { key: 'medium', focus: 50, breakMin: 10, long: 20 },
        { key: 'long',   focus: 90, breakMin: 15, long: 30 },
    ];

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
                    'relative w-full max-w-sm bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-6 transition-all duration-220',
                    visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white tracking-tight">Timer Settings</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors btn-press"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4 text-white/60" />
                    </button>
                </div>

                {/* Presets */}
                <div className="mb-5">
                    <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-3">
                        Presets — Focus / Break / Long
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        {presetButtons.map(({ key, focus, breakMin, long }) => (
                            <button
                                key={key}
                                onClick={() => handlePresetSelect(key)}
                                className={cn(
                                    'p-3 rounded-xl text-xs font-medium transition-all btn-press border',
                                    currentPreset === key
                                        ? 'bg-white/15 border-white/30 text-white'
                                        : 'bg-white/4 border-white/8 text-white/50 hover:bg-white/8 hover:text-white/80'
                                )}
                            >
                                <div className="font-semibold text-sm mb-0.5">{focus}m</div>
                                <div className="opacity-60">{breakMin} / {long}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/8 my-4" />

                {/* Custom */}
                <div>
                    <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-3">
                        Custom (minutes)
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                            { field: 'focus' as const, label: 'Focus', max: 180 },
                            { field: 'break' as const, label: 'Break', max: 60 },
                            { field: 'longBreak' as const, label: 'Long', max: 90 },
                        ].map(({ field, label, max }) => (
                            <div key={field}>
                                <label className="text-xs text-white/35 mb-1.5 block">{label}</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={max}
                                    value={localCustom[field]}
                                    onChange={(e) => setLocalCustom({ ...localCustom, [field]: e.target.value })}
                                    className="w-full px-2 py-2 bg-white/8 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-white/20 transition-all [color-scheme:dark] appearance-none"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleCustomSave}
                        className={cn(
                            'w-full py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 btn-press',
                            currentPreset === 'custom'
                                ? 'bg-white/15 text-white border border-white/25'
                                : 'bg-white/8 text-white/70 hover:bg-white/12 hover:text-white border border-white/10'
                        )}
                    >
                        <Check className="w-4 h-4" />
                        {currentPreset === 'custom' ? 'Custom active' : 'Use custom'}
                    </button>
                </div>
            </div>
        </div>
    );
}
